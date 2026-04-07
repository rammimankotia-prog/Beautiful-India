<?php
define('SITE_URL', 'https://bhaktikishakti.com/');

function get_all_tours() {
    if (!file_exists('tours.json')) {
        return [];
    }
    $json_data = file_get_contents('tours.json');
    return json_decode($json_data, true) ?? [];
}

function get_tour_by_slug($slug) {
    $tours = get_all_tours();
    foreach ($tours as $tour) {
        if ($tour['slug'] === $slug) {
            return $tour;
        }
    }
    return null;
}

function save_new_tour($new_tour) {
    $current_tours = get_all_tours();
    $current_tours[] = $new_tour;
    return file_put_contents('tours.json', json_encode($current_tours, JSON_PRETTY_PRINT));
}

function generate_slug($title) {
    return strtolower(str_replace(' ', '-', preg_replace('/[^a-zA-Z0-9 ]/', '', $title)));
}

function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function get_all_blog_posts() {
    if (!file_exists('blog.json')) {
        return [];
    }
    $json_data = file_get_contents('blog.json');
    return json_decode($json_data, true) ?? [];
}

function get_blog_post_by_slug($slug) {
    $posts = get_all_blog_posts();
    foreach ($posts as $post) {
        if ($post['slug'] === $slug) {
            return $post;
        }
    }
    return null;
}

function get_tour_by_id($id) {
    $tours = get_all_tours();
    foreach ($tours as $tour) {
        if ($tour['id'] == $id) {
            return $tour;
        }
    }
    return null;
}

function update_tour($id, $updated_tour) {
    $tours = get_all_tours();
    foreach ($tours as &$tour) {
        if ($tour['id'] == $id) {
            $tour = array_merge($tour, $updated_tour);
            break;
        }
    }
    return file_put_contents('tours.json', json_encode($tours, JSON_PRETTY_PRINT));
}

function delete_tour($id) {
    $tours = get_all_tours();
    $tours = array_filter($tours, function($tour) use ($id) {
        return $tour['id'] != $id;
    });
    $tours = array_values($tours);
    foreach ($tours as &$tour) {
        $tour['id'] = array_search($tour, array_values($tours)) + 1;
    }
    return file_put_contents('tours.json', json_encode($tours, JSON_PRETTY_PRINT));
}

function save_inquiry($inquiry) {
    $inquiries = [];
    if (file_exists('inquiries.json')) {
        $json_data = file_get_contents('inquiries.json');
        $inquiries = json_decode($json_data, true) ?? [];
    }
    $inquiry['id'] = count($inquiries) + 1;
    $inquiry['created_at'] = date('Y-m-d H:i:s');
    $inquiries[] = $inquiry;
    return file_put_contents('inquiries.json', json_encode($inquiries, JSON_PRETTY_PRINT));
}

function get_all_inquiries() {
    if (!file_exists('inquiries.json')) {
        return [];
    }
    $json_data = file_get_contents('inquiries.json');
    return json_decode($json_data, true) ?? [];
}
