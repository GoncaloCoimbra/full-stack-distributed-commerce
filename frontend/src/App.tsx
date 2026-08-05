import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback";
import AuthGuard from "./guards/AuthGuard";
import B2BGuard from "./guards/B2BGuard";
import AdminGuard from "./guards/AdminGuard";
import PreviewGuard from "./guards/PreviewGuard";
import AppLayout from "./layouts/AppLayout";
import { useAuthStore } from "./store/authStore";
import { useCartStore } from "./store/cartStore";
import { trackEvent } from "./services/analytics";

/* ── Públicas ── */
const HomePage             = lazy(() => import("@/pages/public/HomePage"));
const AboutPage            = lazy(() => import("@/pages/public/AboutPage"));
const ContactPage          = lazy(() => import("@/pages/public/ContactPage"));
const FaqPage              = lazy(() => import("@/pages/public/FaqPage"));
const BlogPage             = lazy(() => import("@/pages/public/BlogPage"));
const BlogPostPage         = lazy(() => import("@/pages/public/BlogPostPage"));
const PricingPage          = lazy(() => import("@/pages/public/PricingPage"));
const PrivacyPage          = lazy(() => import("@/pages/public/PrivacyPage"));
const TermsPage            = lazy(() => import("@/pages/public/TermsPage"));
const ShippingInfoPage     = lazy(() => import("@/pages/public/ShippingInfoPage"));
const SitemapPage          = lazy(() => import("@/pages/public/SitemapPage"));
const CookiePolicyPage     = lazy(() => import("@/pages/public/CookiePolicyPage"));
const BackupPreviewPage   = lazy(() => import("@/pages/public/BackupPreviewPage"));
const LandingPage          = lazy(() => import("@/pages/public/LandingPage"));
const PrintPage            = lazy(() => import("@/pages/public/PrintPage"));        // ← Centro de Cópias
const B2BLandingPage       = lazy(() => import("@/pages/b2b/B2BLandingPage"));
const B2BRegisterPage      = lazy(() => import("@/pages/b2b/B2BRegisterPage"));
const QuoteRequestPage     = lazy(() => import("@/pages/b2b/QuoteRequestPage"));
const QuoteListPage        = lazy(() => import("@/pages/b2b/QuoteListPage"));
const QuoteDetailPage      = lazy(() => import("@/pages/b2b/QuoteDetailPage"));
const B2BAuthPage          = lazy(() => import("@/pages/auth/B2BAuthPage"));
const B2BLoginPage         = lazy(() => import("@/pages/auth/B2BLoginPage"));
const B2BDashboardPage     = lazy(() => import("@/pages/b2b/B2BDashboardPage"));

/* ── Loja ── */
const ShopPage             = lazy(() => import("@/pages/shop/ShopPage"));
const ShopEnhanced         = lazy(() => import("@/pages/shop/ShopEnhanced"));
const EscolarPage          = lazy(() => import("@/pages/shop/EscolarPage"));
const PromotionsPage       = lazy(() => import("@/pages/shop/PromotionsPage"));
const EscritorioPage       = lazy(() => import("@/pages/shop/EscritorioPage"));
const ArtesPage            = lazy(() => import("@/pages/shop/ArtesPage"));
const TecnologiaPage       = lazy(() => import("@/pages/shop/TecnologiaPage"));
const MobiliarioPage       = lazy(() => import("@/pages/shop/MobiliarioPage"));
const ProductDetailPage    = lazy(() => import("@/pages/shop/ProductDetailPage"));
const SubcategoryPage      = lazy(() => import("@/pages/shop/SubcategoryPage"));
const SearchResultsPage    = lazy(() => import("@/pages/shop/SearchResultsPage"));
const BrandPage            = lazy(() => import("@/pages/shop/BrandPage"));
const NewArrivalsPage      = lazy(() => import("@/pages/shop/NewArrivalsPage"));
const RecentlyViewedPage   = lazy(() => import("@/pages/shop/RecentlyViewedPage"));
const WishlistPage         = lazy(() => import("@/pages/shop/WishlistPage"));
const ComparePage          = lazy(() => import("@/pages/shop/ComparePage"));

/* ── Carrinho & Checkout ── */
const CartPage             = lazy(() => import("@/pages/cart/CartPage"));
const CheckoutPage         = lazy(() => import("@/pages/cart/CheckoutPage"));
const CheckoutSuccessPage  = lazy(() => import("@/pages/cart/CheckoutSuccessPage"));

/* ── Autenticação ── */
const LoginPage            = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage         = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage   = lazy(() => import("@/pages/auth/ForgotPasswordPage"));

/* ── Conta ── */
const ProfilePage          = lazy(() => import("@/pages/account/ProfilePage"));
const OrdersPage           = lazy(() => import("@/pages/account/OrdersPage"));
const OrderDetailPage      = lazy(() => import("@/pages/account/OrderDetailPage"));
const InvoicesPage         = lazy(() => import("@/pages/account/InvoicesPage"));
const BillingPage          = lazy(() => import("@/pages/account/BillingPage"));
const NotificationsPage    = lazy(() => import("@/pages/account/NotificationsPage"));
const LoyaltyPointsPage    = lazy(() => import("@/pages/account/LoyaltyPointsPage"));
const ReturnRequestPage    = lazy(() => import("@/pages/account/ReturnRequestPage"));
const ReturnStatusPage     = lazy(() => import("@/pages/account/ReturnStatusPage"));
const ReviewsPage          = lazy(() => import("@/pages/account/ReviewsPage"));

/* ── Suporte ── */
const LiveChatPage         = lazy(() => import("@/pages/support/LiveChatPage"));

/* ── Admin ── */
const AdminOverviewPage    = lazy(() => import("@/pages/admin/AdminOverviewPage"));
const AnalyticsPage        = lazy(() => import("@/pages/admin/AnalyticsPage"));
const AuditAdminPage       = lazy(() => import("@/pages/admin/AuditAdminPage"));
const ContentManagePage    = lazy(() => import("@/pages/admin/ContentManagePage"));
const CustomerManagePage   = lazy(() => import("@/pages/admin/CustomerManagePage"));
const CouponManagePage     = lazy(() => import("@/pages/admin/CouponManagePage"));
const NewsletterManagePage = lazy(() => import("@/pages/admin/NewsletterManagePage"));
const B2BRequestsPage      = lazy(() => import("@/pages/admin/B2BRequestsPage"));

/* ── Erros ── */
const NotFoundPage         = lazy(() => import("@/pages/errors/NotFoundPage"));
const UnauthorizedPage     = lazy(() => import("@/pages/errors/UnauthorizedPage"));
const ErrorPage            = lazy(() => import("@/pages/errors/ErrorPage"));

/* ── Wrapper com ErrorBoundary + Suspense ── */
const wrap = (Component: React.ComponentType) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

export default function App() {
  const restoreSession = useAuthStore(state => state.restoreSession);
  const user = useAuthStore(state => state.user);
  const loadCart = useCartStore(state => state.loadCart);
  const location = useLocation();

  useEffect(() => {
    restoreSession().catch((error) => {
      if (error?.statusCode === 401) {
        localStorage.removeItem('auth_token');
      }
    });
  }, [restoreSession]);

  useEffect(() => {
    if (user) {
      loadCart().catch(() => undefined);
    }
  }, [user, loadCart]);

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
  }, [location.pathname]);

  return (
    <Routes>

      {/* ── Públicas ── */}
      <Route path="/"               element={wrap(HomePage)} />
      <Route path="/landing"        element={wrap(LandingPage)} />
      <Route path="/about"          element={wrap(AboutPage)} />
      <Route path="/contact"        element={wrap(ContactPage)} />
      <Route path="/b2b"            element={wrap(B2BLandingPage)} />
      <Route path="/faq"            element={wrap(FaqPage)} />
      <Route path="/blog"           element={wrap(BlogPage)} />
      <Route path="/blog/:slug"     element={wrap(BlogPostPage)} />
      <Route path="/blog/post"      element={wrap(BlogPostPage)} />
      <Route path="/pricing"        element={wrap(PricingPage)} />
      <Route path="/privacy"        element={wrap(PrivacyPage)} />
      <Route path="/terms"          element={wrap(TermsPage)} />
      <Route path="/shipping"       element={wrap(ShippingInfoPage)} />
      <Route path="/sitemap"        element={wrap(SitemapPage)} />
      <Route path="/cookies"        element={wrap(CookiePolicyPage)} />

      {/* ── Loja ── */}
      <Route path="/shop"                        element={wrap(ShopPage)} />
      <Route path="/shop/enhanced"               element={wrap(ShopEnhanced)} />
      <Route path="/shop/escolar"                element={wrap(EscolarPage)} />
      <Route path="/shop/ofertas"                element={wrap(PromotionsPage)} />
      <Route path="/shop/escritorio"             element={wrap(EscritorioPage)} />
      <Route path="/shop/artes"                  element={wrap(ArtesPage)} />
      <Route path="/shop/tecnologia"             element={wrap(TecnologiaPage)} />
      <Route path="/shop/mobiliario"             element={wrap(MobiliarioPage)} />
      <Route path="/shop/impressao"              element={wrap(PrintPage)} />          {/* ← Centro de Cópias */}
      <Route path="/shop/product/:id"            element={wrap(ProductDetailPage)} />
      <Route path="/shop/category/:subcategory"  element={wrap(SubcategoryPage)} />
      <Route path="/shop/brand/:brand"           element={wrap(BrandPage)} />
      <Route path="/shop/novidades"              element={wrap(NewArrivalsPage)} />
      <Route path="/shop/wishlist"               element={wrap(WishlistPage)} />
      <Route path="/shop/vistos-recentemente"    element={wrap(RecentlyViewedPage)} />
      <Route path="/shop/compare"                element={wrap(ComparePage)} />
      <Route path="/search"                      element={wrap(SearchResultsPage)} />

      {/* ── Carrinho & Checkout ── */}
      <Route path="/cart"             element={wrap(CartPage)} />
      <Route path="/checkout"         element={<AuthGuard>{wrap(CheckoutPage)}</AuthGuard>} />
      <Route path="/checkout/success" element={<AuthGuard>{wrap(CheckoutSuccessPage)}</AuthGuard>} />

      {/* ── Autenticação ── */}
      <Route path="/auth/login"         element={<AppLayout bare>{wrap(LoginPage)}</AppLayout>} />
      <Route path="/auth/register"      element={<AppLayout bare>{wrap(RegisterPage)}</AppLayout>} />
      <Route path="/auth/forgot"        element={<AppLayout bare>{wrap(ForgotPasswordPage)}</AppLayout>} />
      <Route path="/auth/b2b"          element={<AppLayout bare>{wrap(B2BAuthPage)}</AppLayout>} />
      <Route path="/auth/b2b/login"    element={<AppLayout bare>{wrap(B2BLoginPage)}</AppLayout>} />
      <Route path="/auth/b2b/register" element={<AppLayout bare>{wrap(B2BRegisterPage)}</AppLayout>} />
      <Route path="/b2b/quote-request" element={wrap(QuoteRequestPage)} />
      <Route path="/backup" element={<AppLayout bare>{wrap(BackupPreviewPage)}</AppLayout>} />
      <Route path="/backup/checkout" element={<PreviewGuard role="user">{wrap(CheckoutPage)}</PreviewGuard>} />
      <Route path="/backup/checkout/success" element={<PreviewGuard role="user">{wrap(CheckoutSuccessPage)}</PreviewGuard>} />
      <Route path="/backup/account/profile" element={<PreviewGuard role="user">{wrap(ProfilePage)}</PreviewGuard>} />
      <Route path="/backup/account/orders/:id" element={<PreviewGuard role="user">{wrap(OrderDetailPage)}</PreviewGuard>} />
      <Route path="/backup/account/orders" element={<PreviewGuard role="user">{wrap(OrdersPage)}</PreviewGuard>} />
      <Route path="/backup/account/invoices" element={<PreviewGuard role="user">{wrap(InvoicesPage)}</PreviewGuard>} />
      <Route path="/backup/account/billing" element={<PreviewGuard role="user">{wrap(BillingPage)}</PreviewGuard>} />
      <Route path="/backup/account/notifications" element={<PreviewGuard role="user">{wrap(NotificationsPage)}</PreviewGuard>} />
      <Route path="/backup/account/loyalty" element={<PreviewGuard role="user">{wrap(LoyaltyPointsPage)}</PreviewGuard>} />
      <Route path="/backup/account/returns/request" element={<PreviewGuard role="user">{wrap(ReturnRequestPage)}</PreviewGuard>} />
      <Route path="/backup/account/returns/status" element={<PreviewGuard role="user">{wrap(ReturnStatusPage)}</PreviewGuard>} />
      <Route path="/backup/account/reviews" element={<PreviewGuard role="user">{wrap(ReviewsPage)}</PreviewGuard>} />
      <Route path="/backup/b2b/quotes" element={<PreviewGuard role="b2b">{wrap(QuoteListPage)}</PreviewGuard>} />
      <Route path="/backup/b2b/quote/:id" element={<PreviewGuard role="b2b">{wrap(QuoteDetailPage)}</PreviewGuard>} />
      <Route path="/backup/b2b/dashboard" element={<PreviewGuard role="b2b">{wrap(B2BDashboardPage)}</PreviewGuard>} />
      <Route path="/backup/admin" element={<PreviewGuard role="admin">{wrap(AdminOverviewPage)}</PreviewGuard>} />
      <Route path="/backup/admin/audit" element={<PreviewGuard role="admin">{wrap(AuditAdminPage)}</PreviewGuard>} />
      <Route path="/backup/admin/b2b" element={<PreviewGuard role="admin">{wrap(B2BRequestsPage)}</PreviewGuard>} />
      <Route path="/backup/admin/content" element={<PreviewGuard role="admin">{wrap(ContentManagePage)}</PreviewGuard>} />
      <Route path="/backup/admin/customers" element={<PreviewGuard role="admin">{wrap(CustomerManagePage)}</PreviewGuard>} />
      <Route path="/backup/admin/coupons" element={<PreviewGuard role="admin">{wrap(CouponManagePage)}</PreviewGuard>} />
      <Route path="/backup/admin/newsletter" element={<PreviewGuard role="admin">{wrap(NewsletterManagePage)}</PreviewGuard>} />
      <Route path="/b2b/quotes"        element={<B2BGuard>{wrap(QuoteListPage)}</B2BGuard>} />
      <Route path="/b2b/quote/:id"     element={<B2BGuard>{wrap(QuoteDetailPage)}</B2BGuard>} />
      <Route path="/b2b/dashboard"     element={<B2BGuard>{wrap(B2BDashboardPage)}</B2BGuard>} />

      {/* ── Conta ── */}
      <Route path="/account/profile"         element={<AuthGuard>{wrap(ProfilePage)}</AuthGuard>} />
      <Route path="/account/orders/:id"      element={<AuthGuard>{wrap(OrderDetailPage)}</AuthGuard>} />
      <Route path="/account/orders"          element={<AuthGuard>{wrap(OrdersPage)}</AuthGuard>} />
      <Route path="/account/invoices"        element={<AuthGuard>{wrap(InvoicesPage)}</AuthGuard>} />
      <Route path="/account/billing"         element={<AuthGuard>{wrap(BillingPage)}</AuthGuard>} />
      <Route path="/account/notifications"   element={<AuthGuard>{wrap(NotificationsPage)}</AuthGuard>} />
      <Route path="/account/loyalty"         element={<AuthGuard>{wrap(LoyaltyPointsPage)}</AuthGuard>} />
      <Route path="/account/returns/request" element={<AuthGuard>{wrap(ReturnRequestPage)}</AuthGuard>} />
      <Route path="/account/returns/status"  element={<AuthGuard>{wrap(ReturnStatusPage)}</AuthGuard>} />
      <Route path="/account/reviews"         element={<AuthGuard>{wrap(ReviewsPage)}</AuthGuard>} />

      {/* ── Suporte ── */}
      <Route path="/support/live-chat" element={wrap(LiveChatPage)} />

      {/* ── Admin ── */}
      <Route path="/admin"              element={<AdminGuard>{wrap(AdminOverviewPage)}</AdminGuard>} />
      <Route path="/admin/analytics"    element={<AdminGuard>{wrap(AnalyticsPage)}</AdminGuard>} />
      <Route path="/admin/audit"        element={<AdminGuard>{wrap(AuditAdminPage)}</AdminGuard>} />
      <Route path="/admin/b2b"          element={<AdminGuard>{wrap(B2BRequestsPage)}</AdminGuard>} />
      <Route path="/admin/content"      element={<AdminGuard>{wrap(ContentManagePage)}</AdminGuard>} />
      <Route path="/admin/customers"    element={<AdminGuard>{wrap(CustomerManagePage)}</AdminGuard>} />
      <Route path="/admin/coupons"      element={<AdminGuard>{wrap(CouponManagePage)}</AdminGuard>} />
      <Route path="/admin/newsletter"   element={<AdminGuard>{wrap(NewsletterManagePage)}</AdminGuard>} />

      {/* ── Erros ── */}
      <Route path="/401" element={wrap(UnauthorizedPage)} />
      <Route path="/404" element={wrap(NotFoundPage)} />
      <Route path="/500" element={wrap(ErrorPage)} />

      {/* Qualquer rota desconhecida → 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />

    </Routes>
  );
}