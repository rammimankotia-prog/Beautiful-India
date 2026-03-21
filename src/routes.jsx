
import React from 'react';
import NavigationHub from './pages/NavigationHub';
import BeautifulIndiaHome from './pages/BeautifulIndiaHome';
import PrivacyPolicyLayout from './pages/PrivacyPolicyLayout';
import TermsOfServiceLayout from './pages/TermsOfServiceLayout';
import TourDetailView from './pages/TourDetailView';
import TripDepartureCountdownEmail from './pages/24HourTripDepartureCountdownEmail';
import ErrorPageNotFound from './pages/404ErrorPageNotFound';
import AdminBookingManagementDashboard from './pages/AdminBookingManagementDashboard';
import AdminLeadsDashboard from './pages/AdminLeadsDashboard';
import AdminChatbotFlow from './pages/AdminChatbotFlow';
import AdminNewTourUploadForm from './pages/AdminNewTourUploadForm';
import AdminTourManagementDashboard from './pages/AdminTourManagementDashboard';
import AdminOverviewDashboard from './pages/AdminOverviewDashboard';
import AdminQueryManagement from './pages/AdminQueryManagement';
import AdminArticleManagementDashboard from './pages/AdminArticleManagementDashboard';
import AdminNewArticleUploadForm from './pages/AdminNewArticleUploadForm';
import AdminCategorizationSettings from './pages/AdminCategorizationSettings';
import AdminThemeManagement from './pages/AdminThemeManagement';
import BookingCancellationConfirmationEmail from './pages/BookingCancellationConfirmationEmail';
import BookingCancellationRequestForm from './pages/BookingCancellationRequestForm';
import BookingConfirmationSuccess1 from './pages/BookingConfirmationSuccess1';
import BookingConfirmationSuccess2 from './pages/BookingConfirmationSuccess2';
import CheckoutPaymentMethod from './pages/CheckoutPaymentMethod';
import CheckoutTravelerDetails from './pages/CheckoutTravelerDetails';
import CustomerSuccessStoryDetail from './pages/CustomerSuccessStoryDetail';
import CustomTripQuoteRequestEmail from './pages/CustomTripQuoteRequestEmail';
import GiftCardCheckoutDelivery from './pages/GiftCardCheckoutDelivery';
import GiftCardDeliveryEmailTemplate from './pages/GiftCardDeliveryEmailTemplate';
import GiftCardPersonalizeYourGift from './pages/GiftCardPersonalizeYourGift';
import GiftCardPurchaseConfirmed from './pages/GiftCardPurchaseConfirmed';
import MemberOnlyExclusiveTourEmail from './pages/MemberOnlyExclusiveTourEmail';
import ReferralCreditAppliedNotification from './pages/ReferralCreditAppliedNotification';
import ReferralInviteEmailTemplate from './pages/ReferralInviteEmailTemplate';
import ReferralRewardsDashboard from './pages/ReferralRewardsDashboard';
import ReferralRewardMilestonePopUp from './pages/ReferralRewardMilestonePopUp';
import ReferAFriendRewards from './pages/ReferAFriendRewards';
import SavedTripsWishlist from './pages/SavedTripsWishlist';
import SeasonalReferralCampaignLandingPage from './pages/SeasonalReferralCampaignLandingPage';
import SeasonalTourSalePromotionalEmail from './pages/SeasonalTourSalePromotionalEmail';
import SecurePasswordResetEmail from './pages/SecurePasswordResetEmail';
import SmartPackingListGenerator from './pages/SmartPackingListGenerator';
import ToursDiscoveryFiltering1 from './pages/ToursDiscoveryFiltering1';
import TourComparisonPage from './pages/TourComparisonPage';
import ToursDiscoveryFiltering2 from './pages/ToursDiscoveryFiltering2';
import ToursDiscoveryFiltering3 from './pages/ToursDiscoveryFiltering3';
import ToursDiscoveryFiltering4 from './pages/ToursDiscoveryFiltering4';
import ToursDiscoveryFiltering5 from './pages/ToursDiscoveryFiltering5';
import ToursDiscoveryFiltering6 from './pages/ToursDiscoveryFiltering6';
import ToursDiscoveryFiltering7 from './pages/ToursDiscoveryFiltering7';
import ToursDiscoveryFiltering8 from './pages/ToursDiscoveryFiltering8';
import TourReviewConfirmationEmail from './pages/TourReviewConfirmationEmail';
import TourReviewSubmissionForm from './pages/TourReviewSubmissionForm';
import TravelAdvisorySafetyGuide from './pages/TravelAdvisorySafetyGuide';
import TravelBlogPostDetailView1 from './pages/TravelBlogPostDetailView1';
import TravelBlogPostDetailView2 from './pages/TravelBlogPostDetailView2';
import TravelGuidesCategoryLanding from './pages/TravelGuidesCategoryLanding';
import TripAnniversaryMilestoneEmail from './pages/TripAnniversaryMilestoneEmail';
import UpcomingTripBookingReminderEmail from './pages/UpcomingTripBookingReminderEmail';
import UserMyBookingsHistory from './pages/UserMyBookingsHistory';
import WaitlistJoinConfirmationEmail from './pages/WaitlistJoinConfirmationEmail';
import BharatBotConsultationSuccessScreen from './pages/BharatBotConsultationSuccessScreen';
import BharatBotLimitedTimeFlashSaleCard from './pages/BharatBotLimitedTimeFlashSaleCard';
import BharatBotRecommendedToursView from './pages/BharatBotRecommendedToursView';
import BharatBotTourMatchmakerChatbot from './pages/BharatBotTourMatchmakerChatbot';
import WelcomeEmailTemplate from './pages/WelcomeEmailTemplate';
import BharatDarshanPage from './pages/BharatDarshanPage';
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUsPage';
import FestivalsPage from './pages/FestivalsPage';
import ToursByTrain from './pages/ToursByTrain';

/**
 * All 56 Beautiful India pages, organised by group.
 * Generated by build-site.cjs
 */
export const routes = [
  { path: '/nav',  element: <NavigationHub /> },
  { path: '/sitemap', element: <NavigationHub /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/about', element: <AboutUsPage /> },
  { path: '/festivals', element: <FestivalsPage /> },
  { path: '/', element: <BharatDarshanPage /> },
  { path: '/', element: <BeautifulIndiaHome /> },
  { path: '/privacy', element: <PrivacyPolicyLayout /> },
  { path: '/terms', element: <TermsOfServiceLayout /> },
  { path: '/tours/detail', element: <TourDetailView /> },
  { path: '/tours/:id', element: <TourDetailView /> },
  { path: '/tour/:id', element: <TourDetailView /> },
  { path: '/tours/:destination/:stateRegion/:subregion/:title', element: <TourDetailView /> },
  { path: '/emails/countdown', element: <TripDepartureCountdownEmail /> },
  { path: '/404', element: <ErrorPageNotFound /> },
  { path: '/admin/bookings', element: <AdminBookingManagementDashboard /> },
  { path: '/admin/leads', element: <AdminLeadsDashboard /> },
  { path: '/admin/queries', element: <AdminLeadsDashboard /> },
  { path: '/admin/tours/new', element: <AdminNewTourUploadForm /> },
  { path: '/admin/tours/edit/:id', element: <AdminNewTourUploadForm /> },
  { path: '/admin/tours', element: <AdminTourManagementDashboard /> },
  { path: '/admin/overview', element: <AdminOverviewDashboard /> },
  { path: '/admin', element: <AdminTourManagementDashboard /> },
  { path: '/admin/guides', element: <AdminArticleManagementDashboard /> },
  { path: '/admin/guides/new', element: <AdminNewArticleUploadForm /> },
  { path: '/admin/guides/edit/:id', element: <AdminNewArticleUploadForm /> },
  { path: '/admin/categorization', element: <AdminCategorizationSettings /> },
  { path: '/admin/chatbot-flow', element: <AdminChatbotFlow /> },
  { path: '/admin/themes', element: <AdminThemeManagement /> },
  { path: '/emails/cancel-confirm', element: <BookingCancellationConfirmationEmail /> },
  { path: '/booking/cancel', element: <BookingCancellationRequestForm /> },
  { path: '/booking/success', element: <BookingConfirmationSuccess1 /> },
  { path: '/booking/success-2', element: <BookingConfirmationSuccess2 /> },
  { path: '/checkout/payment', element: <CheckoutPaymentMethod /> },
  { path: '/checkout/traveler', element: <CheckoutTravelerDetails /> },
  { path: '/success-story', element: <CustomerSuccessStoryDetail /> },
  { path: '/emails/quote-request', element: <CustomTripQuoteRequestEmail /> },
  { path: '/gift-cards/checkout', element: <GiftCardCheckoutDelivery /> },
  { path: '/gift-cards/delivery-email', element: <GiftCardDeliveryEmailTemplate /> },
  { path: '/gift-cards', element: <GiftCardPersonalizeYourGift /> },
  { path: '/gift-cards/confirmed', element: <GiftCardPurchaseConfirmed /> },
  { path: '/emails/member-offer', element: <MemberOnlyExclusiveTourEmail /> },
  { path: '/referral/credit-applied', element: <ReferralCreditAppliedNotification /> },
  { path: '/emails/referral-invite', element: <ReferralInviteEmailTemplate /> },
  { path: '/referral/dashboard', element: <ReferralRewardsDashboard /> },
  { path: '/referral/milestone', element: <ReferralRewardMilestonePopUp /> },
  { path: '/referral', element: <ReferAFriendRewards /> },
  { path: '/account/wishlist', element: <SavedTripsWishlist /> },
  { path: '/referral/campaign', element: <SeasonalReferralCampaignLandingPage /> },
  { path: '/emails/seasonal-sale', element: <SeasonalTourSalePromotionalEmail /> },
  { path: '/emails/password-reset', element: <SecurePasswordResetEmail /> },
  { path: '/account/packing-list', element: <SmartPackingListGenerator /> },
  { path: '/tours/compare', element: <TourComparisonPage /> },
  { path: '/tours', element: <ToursDiscoveryFiltering1 /> },
  { path: '/tours/filter/2', element: <ToursDiscoveryFiltering2 /> },
  { path: '/tours/filter/3', element: <ToursDiscoveryFiltering3 /> },
  { path: '/tours/filter/4', element: <ToursDiscoveryFiltering4 /> },
  { path: '/tours/filter/5', element: <ToursDiscoveryFiltering5 /> },
  { path: '/tours/filter/6', element: <ToursDiscoveryFiltering6 /> },
  { path: '/tours/filter/7', element: <ToursDiscoveryFiltering7 /> },
  { path: '/tours/filter/8', element: <ToursDiscoveryFiltering8 /> },
  { path: '/emails/review-confirm', element: <TourReviewConfirmationEmail /> },
  { path: '/account/review', element: <TourReviewSubmissionForm /> },
  { path: '/guides/safety', element: <TravelAdvisorySafetyGuide /> },
  { path: '/blog/post-1', element: <TravelBlogPostDetailView1 /> },
  { path: '/blog/post-2', element: <TravelBlogPostDetailView2 /> },
  { path: '/guides', element: <TravelGuidesCategoryLanding /> },
  { path: '/emails/anniversary', element: <TripAnniversaryMilestoneEmail /> },
  { path: '/emails/trip-reminder', element: <UpcomingTripBookingReminderEmail /> },
  { path: '/account/bookings', element: <UserMyBookingsHistory /> },
  { path: '/emails/waitlist', element: <WaitlistJoinConfirmationEmail /> },
  { path: '/bharatbot/success', element: <BharatBotConsultationSuccessScreen /> },
  { path: '/bharatbot/flash-sale', element: <BharatBotLimitedTimeFlashSaleCard /> },
  { path: '/bharatbot/recommendations', element: <BharatBotRecommendedToursView /> },
  { path: '/bharatbot', element: <BharatBotTourMatchmakerChatbot /> },
  { path: '/emails/welcome', element: <WelcomeEmailTemplate /> },
  { path: '/bharat-darshan', element: <BharatDarshanPage /> },
  { path: '/tours/tours-by-train', element: <ToursByTrain /> },
  { path: '/:regionSlug', element: <ToursDiscoveryFiltering1 /> }
];
