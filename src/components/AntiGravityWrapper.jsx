import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const AntiGravityWrapper = ({ children }) => {
    const boxRef = useRef(null);
    const canvasRef = useRef(null);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if (!isEnabled) return;

        const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;
        const engine = Engine.create();
        const { world } = engine;
        
        // Zero gravity for that "Anti-Gravity" effect
        world.gravity.y = 0;

        const render = Render.create({
            element: boxRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent'
            }
        });

        // Find elements to "float"
        const elements = document.querySelectorAll('.float-element');
        const bodies = Array.from(elements).map(el => {
            const rect = el.getBoundingClientRect();
            const body = Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                {
                    chamfer: { radius: 10 },
                    render: { visible: false } // Hidden physics bodies
                }
            );
            
            // Apply slight random push
            Matter.Body.setVelocity(body, { 
                x: (Math.random() - 0.5) * 5, 
                y: (Math.random() - 0.5) * 5 
            });

            return { body, el };
        });

        World.add(world, bodies.map(b => b.body));

        // Add boundaries
        World.add(world, [
            Bodies.rectangle(window.innerWidth/2, -50, window.innerWidth, 100, { isStatic: true }),
            Bodies.rectangle(window.innerWidth/2, window.innerHeight+50, window.innerWidth, 100, { isStatic: true }),
            Bodies.rectangle(-50, window.innerHeight/2, 100, window.innerHeight, { isStatic: true }),
            Bodies.rectangle(window.innerWidth+50, window.innerHeight/2, 100, window.innerHeight, { isStatic: true })
        ]);

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: { stiffness: 0.2, render: { visible: false } }
        });
        World.add(world, mouseConstraint);

        Runner.run(Runner.create(), engine);

        // Sync HTML elements with physics bodies
        const update = () => {
            bodies.forEach(({ body, el }) => {
                el.style.transform = `translate(${body.position.x - (el.offsetWidth/2 + body.bounds.min.x)}px, ${body.position.y - (el.offsetHeight/2 + body.bounds.min.y)}px) rotate(${body.angle}rad)`;
                el.style.position = 'fixed';
                el.style.zIndex = '1000';
                el.style.pointerEvents = 'auto';
            });
            if (isEnabled) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);

        return () => {
            World.clear(world);
            Engine.clear(engine);
            render.canvas.remove();
            bodies.forEach(({ el }) => {
                el.style.position = '';
                el.style.transform = '';
            });
        };
    }, [isEnabled]);

    return (
        <div className="relative min-h-screen">
            {children}
        </div>
    );
};

export default AntiGravityWrapper;
