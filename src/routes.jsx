import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Layouts - Keep static for structural stability
import AdminLayout from './components/AdminLayout';

// Lazy Loaded Pages
const NavigationHub = lazy(() => import('./pages/NavigationHub'));
const BeautifulIndiaHome = lazy(() => import('./pages/BeautifulIndiaHome'));
const PrivacyPolicyLayout = lazy(() => import('./pages/PrivacyPolicyLayout'));
const TermsOfServiceLayout = lazy(() => import('./pages/TermsOfServiceLayout'));
const TourDetailView = lazy(() => import('./pages/TourDetailView'));
const TripDepartureCountdownEmail = lazy(() => import('./pages/24HourTripDepartureCountdownEmail'));
const ErrorPageNotFound = lazy(() => import('./pages/404ErrorPageNotFound'));
const AdminBookingManagementDashboard = lazy(() => import('./pages/AdminBookingManagementDashboard'));
const AdminLeadsDashboard = lazy(() => import('./pages/AdminLeadsDashboard'));
const AdminChatbotFlow = lazy(() => import('./pages/AdminChatbotFlow'));
const AdminNewTourUploadForm = lazy(() => import('./pages/AdminNewTourUploadForm'));
const AdminTourManagementDashboard = lazy(() => import('./pages/AdminTourManagementDashboard'));
const AdminOverviewDashboard = lazy(() => import('./pages/AdminOverviewDashboard'));
const AdminQueryManagement = lazy(() => import('./pages/AdminQueryManagement'));
const AdminArticleManagementDashboard = lazy(() => import('./pages/AdminArticleManagementDashboard'));
const AdminNewArticleUploadForm = lazy(() => import('./pages/AdminNewArticleUploadForm'));
const AdminBikeTourDashboard = lazy(() => import('./pages/AdminBikeTourDashboard'));
const AdminBikeTourForm = lazy(() => import('./pages/AdminBikeTourForm'));
const AdminCategorizationSettings = lazy(() => import('./pages/AdminCategorizationSettings'));
const AdminThemeManagement = lazy(() => import('./pages/AdminThemeManagement'));
const AdminTrainQueries = lazy(() => import('./pages/AdminTrainQueries'));
const AdminUserManagement = lazy(() => import('./pages/AdminUserManagement'));
const AdminSupportSettings = lazy(() => import('./pages/AdminSupportSettings'));
const BookingCancellationConfirmationEmail = lazy(() => import('./pages/BookingCancellationConfirmationEmail'));
const BookingCancellationRequestForm = lazy(() => import('./pages/BookingCancellationRequestForm'));
const BookingConfirmationSuccess1 = lazy(() => import('./pages/BookingConfirmationSuccess1'));
const BookingConfirmationSuccess2 = lazy(() => import('./pages/BookingConfirmationSuccess2'));
const CheckoutPaymentMethod = lazy(() => import('./pages/CheckoutPaymentMethod'));
const CheckoutTravelerDetails = lazy(() => import('./pages/CheckoutTravelerDetails'));
const CustomerSuccessStoryDetail = lazy(() => import('./pages/CustomerSuccessStoryDetail'));
const CustomTripQuoteRequestEmail = lazy(() => import('./pages/CustomTripQuoteRequestEmail'));
const GiftCardCheckoutDelivery = lazy(() => import('./pages/GiftCardCheckoutDelivery'));
const GiftCardDeliveryEmailTemplate = lazy(() => import('./pages/GiftCardDeliveryEmailTemplate'));
const GiftCardPersonalizeYourGift = lazy(() => import('./pages/GiftCardPersonalizeYourGift'));
const GiftCardPurchaseConfirmed = lazy(() => import('./pages/GiftCardPurchaseConfirmed'));
const MemberOnlyExclusiveTourEmail = lazy(() => import('./pages/MemberOnlyExclusiveTourEmail'));
const ReferralCreditAppliedNotification = lazy(() => import('./pages/ReferralCreditAppliedNotification'));
const ReferralInviteEmailTemplate = lazy(() => import('./pages/ReferralInviteEmailTemplate'));
const ReferralRewardsDashboard = lazy(() => import('./pages/ReferralRewardsDashboard'));
const ReferralRewardMilestonePopUp = lazy(() => import('./pages/ReferralRewardMilestonePopUp'));
const ReferAFriendRewards = lazy(() => import('./pages/ReferAFriendRewards'));
const SavedTripsWishlist = lazy(() => import('./pages/SavedTripsWishlist'));
const SeasonalReferralCampaignLandingPage = lazy(() => import('./pages/SeasonalReferralCampaignLandingPage'));
const SeasonalTourSalePromotionalEmail = lazy(() => import('./pages/SeasonalTourSalePromotionalEmail'));
const SecurePasswordResetEmail = lazy(() => import('./pages/SecurePasswordResetEmail'));
const SmartPackingListGenerator = lazy(() => import('./pages/SmartPackingListGenerator'));
const ToursDiscoveryFiltering1 = lazy(() => import('./pages/ToursDiscoveryFiltering1'));
const TourComparisonPage = lazy(() => import('./pages/TourComparisonPage'));
const ToursDiscoveryFiltering2 = lazy(() => import('./pages/ToursDiscoveryFiltering2'));
const ToursDiscoveryFiltering3 = lazy(() => import('./pages/ToursDiscoveryFiltering3'));
const ToursDiscoveryFiltering4 = lazy(() => import('./pages/ToursDiscoveryFiltering4'));
const ToursDiscoveryFiltering5 = lazy(() => import('./pages/ToursDiscoveryFiltering5'));
const ToursDiscoveryFiltering6 = lazy(() => import('./pages/ToursDiscoveryFiltering6'));
const ToursDiscoveryFiltering7 = lazy(() => import('./pages/ToursDiscoveryFiltering7'));
const ToursDiscoveryFiltering8 = lazy(() => import('./pages/ToursDiscoveryFiltering8'));
const TourReviewConfirmationEmail = lazy(() => import('./pages/TourReviewConfirmationEmail'));
const TourReviewSubmissionForm = lazy(() => import('./pages/TourReviewSubmissionForm'));
const ReviewSuccessPage = lazy(() => import('./pages/ReviewSuccessPage'));
const TravelAdvisorySafetyGuide = lazy(() => import('./pages/TravelAdvisorySafetyGuide'));
const TravelBlogPostDetailView1 = lazy(() => import('./pages/TravelBlogPostDetailView1'));
const TravelBlogPostDetailView2 = lazy(() => import('./pages/TravelBlogPostDetailView2'));
const TravelGuidesCategoryLanding = lazy(() => import('./pages/TravelGuidesCategoryLanding'));
const GuideDetailView = lazy(() => import('./pages/GuideDetailView'));
const TripAnniversaryMilestoneEmail = lazy(() => import('./pages/TripAnniversaryMilestoneEmail'));
const UpcomingTripBookingReminderEmail = lazy(() => import('./pages/UpcomingTripBookingReminderEmail'));
const UserMyBookingsHistory = lazy(() => import('./pages/UserMyBookingsHistory'));
const WaitlistJoinConfirmationEmail = lazy(() => import('./pages/WaitlistJoinConfirmationEmail'));
const BharatBotConsultationSuccessScreen = lazy(() => import('./pages/BharatBotConsultationSuccessScreen'));
const BharatBotLimitedTimeFlashSaleCard = lazy(() => import('./pages/BharatBotLimitedTimeFlashSaleCard'));
const BharatBotRecommendedToursView = lazy(() => import('./pages/BharatBotRecommendedToursView'));
const BharatBotTourMatchmakerChatbot = lazy(() => import('./pages/BharatBotTourMatchmakerChatbot'));
const WelcomeEmailTemplate = lazy(() => import('./pages/WelcomeEmailTemplate'));
const BharatDarshanPage = lazy(() => import('./pages/BharatDarshanPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const FestivalsPage = lazy(() => import('./pages/FestivalsPage'));
const ToursByTrain = lazy(() => import('./pages/ToursByTrain'));
const BikeTourListingPage = lazy(() => import('./pages/BikeTourListingPage'));
const BikeTourDetailView = lazy(() => import('./pages/BikeTourDetailView'));
const TrainBookingPage = lazy(() => import('./pages/TrainBookingPage'));
const TrainBookingSuccessPage = lazy(() => import('./pages/TrainBookingSuccessPage'));
const PilgrimageToursListingPage = lazy(() => import('./pages/PilgrimageToursListingPage'));
const PilgrimageTourDetailView = lazy(() => import('./pages/PilgrimageTourDetailView'));
const AdminPilgrimageTourDashboard = lazy(() => import('./pages/AdminPilgrimageTourDashboard'));
const AdminPilgrimageTourForm = lazy(() => import('./pages/AdminPilgrimageTourForm'));
// Helper to wrap lazy components in Suspense with localized fallback
const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component {...props} />
  </Suspense>
);

/**
 * All 56 Beautiful India pages, organised by group.
 * Generated by build-site.cjs
 */
export const routes = [
  { path: '/nav',  element: Loadable(NavigationHub)() },
  { path: '/sitemap', element: Loadable(NavigationHub)() },
  { path: '/contact', element: Loadable(ContactPage)() },
  { path: '/about', element: Loadable(AboutUsPage)() },
  { path: '/signin', element: Loadable(SignInPage)() },
  { path: '/festivals', element: Loadable(FestivalsPage)() },
  { path: '/', element: Loadable(BharatDarshanPage)() },
  { path: '/privacy', element: Loadable(PrivacyPolicyLayout)() },
  { path: '/terms', element: Loadable(TermsOfServiceLayout)() },
  { path: '/tours/detail', element: Loadable(TourDetailView)() },
  { path: '/tours/bike-tours', element: Loadable(BikeTourListingPage)() },
  { path: '/tours/bike-tours/:slug', element: Loadable(BikeTourDetailView)() },
  { path: '/tours/:id', element: Loadable(TourDetailView)() },
  { path: '/tour/:id', element: Loadable(TourDetailView)() },
  { path: '/tours/:destination/:stateRegion/:subregion/:title', element: Loadable(TourDetailView)() },
  { path: '/emails/countdown', element: Loadable(TripDepartureCountdownEmail)() },
  { path: '/404', element: Loadable(ErrorPageNotFound)() },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '', element: <Navigate to="/admin/overview" replace /> },
      { path: 'users', element: Loadable(AdminUserManagement)() },
      { path: 'bookings', element: Loadable(AdminBookingManagementDashboard)() },
      { path: 'leads', element: Loadable(AdminLeadsDashboard)() },
      { path: 'queries', element: Loadable(AdminLeadsDashboard)() },
      { path: 'tours/new', element: Loadable(AdminNewTourUploadForm)() },
      { path: 'tours/edit/:id', element: Loadable(AdminNewTourUploadForm)() },
      { path: 'tours', element: Loadable(AdminTourManagementDashboard)() },
      { path: 'overview', element: Loadable(AdminOverviewDashboard)() },
      { path: 'guides', element: Loadable(AdminArticleManagementDashboard)() },
      { path: 'guides/new', element: Loadable(AdminNewArticleUploadForm)() },
      { path: 'guides/edit/:id', element: Loadable(AdminNewArticleUploadForm)() },
      { path: 'categorization', element: Loadable(AdminCategorizationSettings)() },
      { path: 'chatbot-flow', element: Loadable(AdminChatbotFlow)() },
      { path: 'train-queries', element: Loadable(AdminTrainQueries)() },
      { path: 'themes', element: Loadable(AdminThemeManagement)() },
      { path: 'bike-tours', element: Loadable(AdminBikeTourDashboard)() },
      { path: 'bike-tours/new', element: Loadable(AdminBikeTourForm)() },
      { path: 'bike-tours/edit/:id', element: Loadable(AdminBikeTourForm)() },
      { path: 'pilgrimages', element: Loadable(AdminPilgrimageTourDashboard)() },
      { path: 'pilgrimages/create', element: Loadable(AdminPilgrimageTourForm)() },
      { path: 'pilgrimages/edit/:slug', element: Loadable(AdminPilgrimageTourForm)() },
      { path: 'support', element: Loadable(AdminSupportSettings)() },
    ]
  },
  { path: '/emails/cancel-confirm', element: Loadable(BookingCancellationConfirmationEmail)() },
  { path: '/booking/cancel', element: Loadable(BookingCancellationRequestForm)() },
  { path: '/booking/success', element: Loadable(BookingConfirmationSuccess1)() },
  { path: '/booking/success-2', element: Loadable(BookingConfirmationSuccess2)() },
  { path: '/checkout/payment', element: Loadable(CheckoutPaymentMethod)() },
  { path: '/checkout/traveler', element: Loadable(CheckoutTravelerDetails)() },
  { path: '/success-story', element: Loadable(CustomerSuccessStoryDetail)() },
  { path: '/emails/quote-request', element: Loadable(CustomTripQuoteRequestEmail)() },
  { path: '/gift-cards/checkout', element: Loadable(GiftCardCheckoutDelivery)() },
  { path: '/gift-cards/delivery-email', element: Loadable(GiftCardDeliveryEmailTemplate)() },
  { path: '/gift-cards', element: Loadable(GiftCardPersonalizeYourGift)() },
  { path: '/gift-cards/confirmed', element: Loadable(GiftCardPurchaseConfirmed)() },
  { path: '/emails/member-offer', element: Loadable(MemberOnlyExclusiveTourEmail)() },
  { path: '/referral/credit-applied', element: Loadable(ReferralCreditAppliedNotification)() },
  { path: '/emails/referral-invite', element: Loadable(ReferralInviteEmailTemplate)() },
  { path: '/referral/dashboard', element: Loadable(ReferralRewardsDashboard)() },
  { path: '/referral/milestone', element: Loadable(ReferralRewardMilestonePopUp)() },
  { path: '/referral', element: Loadable(ReferAFriendRewards)() },
  { path: '/account/wishlist', element: Loadable(SavedTripsWishlist)() },
  { path: '/referral/campaign', element: Loadable(SeasonalReferralCampaignLandingPage)() },
  { path: '/emails/seasonal-sale', element: Loadable(SeasonalTourSalePromotionalEmail)() },
  { path: '/emails/password-reset', element: Loadable(SecurePasswordResetEmail)() },
  { path: '/account/packing-list', element: Loadable(SmartPackingListGenerator)() },
  { path: '/tours/compare', element: Loadable(TourComparisonPage)() },
  { path: '/tours', element: Loadable(ToursDiscoveryFiltering1)() },
  { path: '/tours/filter/2', element: Loadable(ToursDiscoveryFiltering2)() },
  { path: '/tours/filter/3', element: Loadable(ToursDiscoveryFiltering3)() },
  { path: '/tours/filter/4', element: Loadable(ToursDiscoveryFiltering4)() },
  { path: '/tours/filter/5', element: Loadable(ToursDiscoveryFiltering5)() },
  { path: '/tours/filter/6', element: Loadable(ToursDiscoveryFiltering6)() },
  { path: '/tours/filter/7', element: Loadable(ToursDiscoveryFiltering7)() },
  { path: '/tours/filter/8', element: Loadable(ToursDiscoveryFiltering8)() },
  { path: '/emails/review-confirm', element: Loadable(TourReviewConfirmationEmail)() },
  { path: '/account/review', element: Loadable(TourReviewSubmissionForm)() },
  { path: '/account/review-success', element: Loadable(ReviewSuccessPage)() },
  { path: '/guides/safety', element: Loadable(TravelAdvisorySafetyGuide)() },
  { path: '/blog/post-1', element: Loadable(TravelBlogPostDetailView1)() },
  { path: '/blog/post-2', element: Loadable(TravelBlogPostDetailView2)() },
  { path: '/guides', element: Loadable(TravelGuidesCategoryLanding)() },
  { path: '/guides/:id', element: Loadable(GuideDetailView)() },
  { path: '/emails/anniversary', element: Loadable(TripAnniversaryMilestoneEmail)() },
  { path: '/emails/trip-reminder', element: Loadable(UpcomingTripBookingReminderEmail)() },
  { path: '/account/bookings', element: Loadable(UserMyBookingsHistory)() },
  { path: '/emails/waitlist', element: Loadable(WaitlistJoinConfirmationEmail)() },
  { path: '/bharatbot/success', element: Loadable(BharatBotConsultationSuccessScreen)() },
  { path: '/bharatbot/flash-sale', element: Loadable(BharatBotLimitedTimeFlashSaleCard)() },
  { path: '/bharatbot/recommendations', element: Loadable(BharatBotRecommendedToursView)() },
  { path: '/bharatbot', element: Loadable(BharatBotTourMatchmakerChatbot)() },
  { path: '/emails/welcome', element: Loadable(WelcomeEmailTemplate)() },
  { path: '/bharat-darshan', element: Loadable(BharatDarshanPage)() },
  { path: '/tours/tours-by-train', element: Loadable(ToursByTrain)() },
  { path: '/booking/train', element: Loadable(TrainBookingPage)() },
  { path: '/booking/train-success', element: Loadable(TrainBookingSuccessPage)() },
  { path: '/pilgrimage-tours', element: Loadable(PilgrimageToursListingPage)() },
  { path: '/pilgrimage-tours/:slug', element: Loadable(PilgrimageTourDetailView)() },
  { path: '/:regionSlug', element: Loadable(ToursDiscoveryFiltering1)() }
];
