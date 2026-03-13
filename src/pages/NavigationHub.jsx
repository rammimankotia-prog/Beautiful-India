
import React from 'react';
import { Link } from 'react-router-dom';

const GROUP_META = [
  {
    "id": "main",
    "label": "Main",
    "color": "#006D77",
    "routes": [
      {
        "name": "WanderlustExplorerProHome",
        "path": "/",
        "label": "Home",
        "group": "main",
        "folder": "wanderlust_explorer_pro_home"
      }
    ]
  },
  {
    "id": "legal",
    "label": "Legal",
    "color": "#8d99ae",
    "routes": [
      {
        "name": "PrivacyPolicyLayout",
        "path": "/privacy",
        "label": "Privacy Policy",
        "group": "legal",
        "folder": "privacy_policy_layout"
      },
      {
        "name": "TermsOfServiceLayout",
        "path": "/terms",
        "label": "Terms of Service",
        "group": "legal",
        "folder": "terms_of_service_layout"
      },
      {
        "name": "Page404ErrorPageNotFound",
        "path": "/404",
        "label": "404 Error",
        "group": "legal",
        "folder": "404_error_page_not_found"
      }
    ]
  },
  {
    "id": "tours",
    "label": "Tours",
    "color": "#2a9d8f",
    "routes": [
      {
        "name": "TourDetailView",
        "path": "/tours/detail",
        "label": "Tour Detail (Static)",
        "group": "tours",
        "folder": "tour_detail_view"
      },
      {
        "name": "ToursDiscoveryFiltering1",
        "path": "/tours",
        "label": "Tours",
        "group": "tours",
        "folder": "tours_discovery_filtering_1"
      },
      {
        "name": "ToursDiscoveryFiltering2",
        "path": "/tours/filter/2",
        "label": "Tours – Filter 2",
        "group": "tours",
        "folder": "tours_discovery_filtering_2"
      },
      {
        "name": "ToursDiscoveryFiltering3",
        "path": "/tours/filter/3",
        "label": "Tours – Filter 3",
        "group": "tours",
        "folder": "tours_discovery_filtering_3"
      },
      {
        "name": "ToursDiscoveryFiltering4",
        "path": "/tours/filter/4",
        "label": "Tours – Filter 4",
        "group": "tours",
        "folder": "tours_discovery_filtering_4"
      },
      {
        "name": "ToursDiscoveryFiltering5",
        "path": "/tours/filter/5",
        "label": "Tours – Filter 5",
        "group": "tours",
        "folder": "tours_discovery_filtering_5"
      },
      {
        "name": "ToursDiscoveryFiltering6",
        "path": "/tours/filter/6",
        "label": "Tours – Filter 6",
        "group": "tours",
        "folder": "tours_discovery_filtering_6"
      },
      {
        "name": "ToursDiscoveryFiltering7",
        "path": "/tours/filter/7",
        "label": "Tours – Filter 7",
        "group": "tours",
        "folder": "tours_discovery_filtering_7"
      },
      {
        "name": "ToursDiscoveryFiltering8",
        "path": "/tours/filter/8",
        "label": "Tours – Filter 8",
        "group": "tours",
        "folder": "tours_discovery_filtering_8"
      }
    ]
  },
  {
    "id": "emails",
    "label": "Emails",
    "color": "#6c757d",
    "routes": [
      {
        "name": "Page24HourTripDepartureCountdownEmail",
        "path": "/emails/countdown",
        "label": "24h Countdown Email",
        "group": "emails",
        "folder": "24_hour_trip_departure_countdown_email"
      },
      {
        "name": "BookingCancellationConfirmationEmail",
        "path": "/emails/cancel-confirm",
        "label": "Cancel Confirm Email",
        "group": "emails",
        "folder": "booking_cancellation_confirmation_email"
      },
      {
        "name": "CustomTripQuoteRequestEmail",
        "path": "/emails/quote-request",
        "label": "Quote Request Email",
        "group": "emails",
        "folder": "custom_trip_quote_request_email"
      },
      {
        "name": "MemberOnlyExclusiveTourEmail",
        "path": "/emails/member-offer",
        "label": "Member Offer Email",
        "group": "emails",
        "folder": "member_only_exclusive_tour_email"
      },
      {
        "name": "ReferralInviteEmailTemplate",
        "path": "/emails/referral-invite",
        "label": "Referral Invite Email",
        "group": "emails",
        "folder": "referral_invite_email_template"
      },
      {
        "name": "SeasonalTourSalePromotionalEmail",
        "path": "/emails/seasonal-sale",
        "label": "Seasonal Sale Email",
        "group": "emails",
        "folder": "seasonal_tour_sale_promotional_email"
      },
      {
        "name": "SecurePasswordResetEmail",
        "path": "/emails/password-reset",
        "label": "Password Reset Email",
        "group": "emails",
        "folder": "secure_password_reset_email"
      },
      {
        "name": "TourReviewConfirmationEmail",
        "path": "/emails/review-confirm",
        "label": "Review Confirm Email",
        "group": "emails",
        "folder": "tour_review_confirmation_email"
      },
      {
        "name": "TripAnniversaryMilestoneEmail",
        "path": "/emails/anniversary",
        "label": "Anniversary Email",
        "group": "emails",
        "folder": "trip_anniversary_milestone_email"
      },
      {
        "name": "UpcomingTripBookingReminderEmail",
        "path": "/emails/trip-reminder",
        "label": "Trip Reminder Email",
        "group": "emails",
        "folder": "upcoming_trip_booking_reminder_email"
      },
      {
        "name": "WaitlistJoinConfirmationEmail",
        "path": "/emails/waitlist",
        "label": "Waitlist Email",
        "group": "emails",
        "folder": "waitlist_join_confirmation_email"
      },
      {
        "name": "WelcomeEmailTemplate",
        "path": "/emails/welcome",
        "label": "Welcome Email",
        "group": "emails",
        "folder": "welcome_email_template"
      }
    ]
  },
  {
    "id": "admin",
    "label": "Admin",
    "color": "#c1121f",
    "routes": [
      {
        "name": "AdminBookingManagementDashboard",
        "path": "/admin/bookings",
        "label": "Admin Bookings",
        "group": "admin",
        "folder": "admin_booking_management_dashboard"
      },
      {
        "name": "AdminChatbotLeadManagement",
        "path": "/admin/leads",
        "label": "Admin Chatbot Leads",
        "group": "admin",
        "folder": "admin_chatbot_lead_management"
      },
      {
        "name": "AdminNewTourUploadForm",
        "path": "/admin/tours/new",
        "label": "Admin New Tour",
        "group": "admin",
        "folder": "admin_new_tour_upload_form"
      },
      {
        "name": "AdminTourManagementDashboard",
        "path": "/admin",
        "label": "Admin Dashboard",
        "group": "admin",
        "folder": "admin_tour_management_dashboard"
      }
    ]
  },
  {
    "id": "booking",
    "label": "Booking",
    "color": "#e9c46a",
    "routes": [
      {
        "name": "BookingCancellationRequestForm",
        "path": "/booking/cancel",
        "label": "Cancel Booking",
        "group": "booking",
        "folder": "booking_cancellation_request_form"
      },
      {
        "name": "BookingConfirmationSuccess1",
        "path": "/booking/success",
        "label": "Booking Success",
        "group": "booking",
        "folder": "booking_confirmation_success_1"
      },
      {
        "name": "BookingConfirmationSuccess2",
        "path": "/booking/success-2",
        "label": "Booking Success 2",
        "group": "booking",
        "folder": "booking_confirmation_success_2"
      },
      {
        "name": "CheckoutPaymentMethod",
        "path": "/checkout/payment",
        "label": "Checkout – Payment",
        "group": "booking",
        "folder": "checkout_payment_method"
      },
      {
        "name": "CheckoutTravelerDetails",
        "path": "/checkout/traveler",
        "label": "Checkout – Traveler",
        "group": "booking",
        "folder": "checkout_traveler_details"
      }
    ]
  },
  {
    "id": "content",
    "label": "Content",
    "color": "#264653",
    "routes": [
      {
        "name": "CustomerSuccessStoryDetail",
        "path": "/success-story",
        "label": "Success Story",
        "group": "content",
        "folder": "customer_success_story_detail"
      },
      {
        "name": "TravelAdvisorySafetyGuide",
        "path": "/guides/safety",
        "label": "Safety Guide",
        "group": "content",
        "folder": "travel_advisory_safety_guide"
      },
      {
        "name": "TravelBlogPostDetailView1",
        "path": "/blog/post-1",
        "label": "Blog Post 1",
        "group": "content",
        "folder": "travel_blog_post_detail_view_1"
      },
      {
        "name": "TravelBlogPostDetailView2",
        "path": "/blog/post-2",
        "label": "Blog Post 2",
        "group": "content",
        "folder": "travel_blog_post_detail_view_2"
      },
      {
        "name": "TravelGuidesCategoryLanding",
        "path": "/guides",
        "label": "Travel Guides",
        "group": "content",
        "folder": "travel_guides_category_landing"
      }
    ]
  },
  {
    "id": "gifts",
    "label": "Gifts",
    "color": "#457b9d",
    "routes": [
      {
        "name": "GiftCardCheckoutDelivery",
        "path": "/gift-cards/checkout",
        "label": "Gift Card Checkout",
        "group": "gifts",
        "folder": "gift_card_checkout_delivery"
      },
      {
        "name": "GiftCardDeliveryEmailTemplate",
        "path": "/gift-cards/delivery-email",
        "label": "Gift Card Email",
        "group": "gifts",
        "folder": "gift_card_delivery_email_template"
      },
      {
        "name": "GiftCardPersonalizeYourGift",
        "path": "/gift-cards",
        "label": "Gift Cards",
        "group": "gifts",
        "folder": "gift_card_personalize_your_gift"
      },
      {
        "name": "GiftCardPurchaseConfirmed",
        "path": "/gift-cards/confirmed",
        "label": "Gift Card Confirmed",
        "group": "gifts",
        "folder": "gift_card_purchase_confirmed"
      }
    ]
  },
  {
    "id": "rewards",
    "label": "Rewards",
    "color": "#e76f51",
    "routes": [
      {
        "name": "ReferralCreditAppliedNotification",
        "path": "/referral/credit-applied",
        "label": "Credit Applied",
        "group": "rewards",
        "folder": "referral_credit_applied_notification"
      },
      {
        "name": "ReferralRewardsDashboard",
        "path": "/referral/dashboard",
        "label": "Referral Dashboard",
        "group": "rewards",
        "folder": "referral_rewards_dashboard"
      },
      {
        "name": "ReferralRewardMilestonePopUp",
        "path": "/referral/milestone",
        "label": "Milestone Reward",
        "group": "rewards",
        "folder": "referral_reward_milestone_pop_up"
      },
      {
        "name": "ReferAFriendRewards",
        "path": "/referral",
        "label": "Refer a Friend",
        "group": "rewards",
        "folder": "refer_a_friend_rewards"
      },
      {
        "name": "SeasonalReferralCampaignLandingPage",
        "path": "/referral/campaign",
        "label": "Seasonal Campaign",
        "group": "rewards",
        "folder": "seasonal_referral_campaign_landing_page"
      }
    ]
  },
  {
    "id": "account",
    "label": "Account",
    "color": "#f4a261",
    "routes": [
      {
        "name": "SavedTripsWishlist",
        "path": "/account/wishlist",
        "label": "Saved Trips",
        "group": "account",
        "folder": "saved_trips_wishlist"
      },
      {
        "name": "SmartPackingListGenerator",
        "path": "/account/packing-list",
        "label": "Packing List",
        "group": "account",
        "folder": "smart_packing_list_generator"
      },
      {
        "name": "TourReviewSubmissionForm",
        "path": "/account/review",
        "label": "Write a Review",
        "group": "account",
        "folder": "tour_review_submission_form"
      },
      {
        "name": "UserMyBookingsHistory",
        "path": "/account/bookings",
        "label": "My Bookings",
        "group": "account",
        "folder": "user_my_bookings_history"
      }
    ]
  },
  {
    "id": "ai",
    "label": "Ai",
    "color": "#7b2d8b",
    "routes": [
      {
        "name": "WanderbotConsultationSuccessScreen",
        "path": "/wanderbot/success",
        "label": "WanderBot Success",
        "group": "ai",
        "folder": "wanderbot_consultation_success_screen"
      },
      {
        "name": "WanderbotLimitedTimeFlashSaleCard",
        "path": "/wanderbot/flash-sale",
        "label": "Flash Sale",
        "group": "ai",
        "folder": "wanderbot_limited_time_flash_sale_card"
      },
      {
        "name": "WanderbotRecommendedToursView",
        "path": "/wanderbot/recommendations",
        "label": "WanderBot Picks",
        "group": "ai",
        "folder": "wanderbot_recommended_tours_view"
      },
      {
        "name": "WanderbotTourMatchmakerChatbot",
        "path": "/wanderbot",
        "label": "WanderBot AI",
        "group": "ai",
        "folder": "wanderbot_tour_matchmaker_chatbot"
      }
    ]
  }
];

const NavigationHub = () => (
  <div style={{ fontFamily:'Montserrat,sans-serif', minWidth:1200, padding:'40px 60px', background:'#EDF6F9', minHeight:'100vh' }}>
    <div style={{ maxWidth:1100, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:8 }}>
        <span className="material-symbols-outlined" style={{ fontSize:40, color:'#006D77' }}>explore</span>
        <h1 style={{ fontSize:36, fontWeight:900, color:'#006D77', margin:0 }}>Wanderlust Explorer Pro</h1>
      </div>
      <p style={{ color:'#7F8C8D', marginBottom:48, fontWeight:500 }}>
        56 pages · Full site map · Click any card to navigate
      </p>

      {GROUP_META.map(group => (
        <div key={group.id} style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color: group.color, borderLeft:`4px solid ${group.color}`, paddingLeft:12, marginBottom:16, textTransform:'capitalize' }}>
            {group.label} <span style={{ fontWeight:400, color:'#aaa', fontSize:14 }}>({group.routes.length} pages)</span>
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {group.routes.map(r => (
              <Link key={r.path} to={r.path} style={{ textDecoration:'none' }}>
                <div style={{ background:'#fff', border:`1.5px solid ${group.color}30`, borderRadius:12, padding:'14px 16px',
                              display:'flex', alignItems:'center', justifyContent:'space-between',
                              boxShadow:'0 2px 8px rgba(0,0,0,0.05)', transition:'all .15s', cursor:'pointer' }}
                     onMouseEnter={e => e.currentTarget.style.boxShadow=`0 4px 18px ${group.color}40`}
                     onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'}>
                  <span style={{ fontWeight:700, fontSize:13, color:'#2C3E50', lineHeight:1.3 }}>{r.label}</span>
                  <span className="material-symbols-outlined" style={{ fontSize:18, color:group.color }}>arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NavigationHub;
