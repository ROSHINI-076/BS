import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, X, User, Shield, CreditCard, TrendingUp, Home, Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import BankingPortal from './BankingPortal';
import { useNavigate } from 'react-router-dom';


const ProfessionalBankingWebsite = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Secure Digital Banking Solutions",
      subtitle: "Experience banking redefined with our comprehensive digital platform",
      features: [
        "Advanced security protocols",
        "24/7 customer support",
        "Multi-channel access"
      ],
      buttonText: "Get Started",
      action: "login"
    },
    {
      title: "Personal Loans Up to ₹50 Lakh",
      subtitle: "Quick approval process with competitive interest rates",
      features: [
        "Instant pre-approval",
        "Flexible EMI options",
        "Minimal documentation"
      ],
      buttonText: "Apply Now",
      action: "loan"
    },
    {
      title: "Investment & Wealth Management",
      subtitle: "Grow your wealth with our expert investment advisory services",
      features: [
        "Portfolio management",
        "Market insights",
        "Risk assessment tools"
      ],
      buttonText: "Learn More",
      action: "investment"
    }
  ];

  const services = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Account Management",
      description: "Comprehensive account services including balance inquiry, statement generation, and transaction history.",
      features: ["Real-time balance", "Digital statements", "Transaction alerts"]
    },
    {
      icon: <ArrowRight className="w-8 h-8" />,
      title: "Money Transfer",
      description: "Secure fund transfers through NEFT, RTGS, UPI, and international wire transfers.",
      features: ["Instant transfers", "Global reach", "Low fees"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Investment Services",
      description: "Access to mutual funds, fixed deposits, and equity trading through our integrated platform.",
      features: ["Expert advisory", "Diverse portfolio", "Risk management"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Insurance Solutions",
      description: "Comprehensive insurance products including life, health, motor, and property coverage.",
      features: ["Instant quotes", "Easy claims", "24/7 support"]
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Loan Products",
      description: "Competitive rates on home loans, personal loans, and business financing solutions.",
      features: ["Quick approval", "Flexible terms", "Expert guidance"]
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Customer Support",
      description: "Dedicated relationship managers and multi-channel customer service support.",
      features: ["Personal banking", "Priority service", "Expert advice"]
    }
  ];

  const stats = [
    { number: "2M+", label: "Active Customers" },
    { number: "500+", label: "Branch Network" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Customer Support" }
  ];

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'info' });
    }, 4000);
  };

  const handleSlideAction = (action) => {
  switch (action) {
    case 'login':
      setShowRoleModal(true); // Show role selection first
      break;
    case 'loan':
      showNotification('Loan application portal opening...', 'info');
      break;
    case 'investment':
      showNotification('Investment services portal opening...', 'info');
      break;
    default:
      break;
  }
};

  const handleLogin = () => {
    showNotification('Login functionality will be available soon!', 'success');
    setShowLoginModal(false);
  };

  const moveSlide = (direction) => {
    setCurrentSlide(prev => {
      let newIndex = prev + direction;
      if (newIndex < 0) newIndex = slides.length - 1;
      if (newIndex >= slides.length) newIndex = 0;
      return newIndex;
    });
  };

  return (
    <div className="banking-website">
      <style jsx>{`
        .banking-website {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          line-height: 1.6;
          color: #1f2937;
        }

        /* Header Styles */
        .header {
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 50;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }

        .header.scrolled {
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .logo {
          display: flex;
          align-items: center;
        }

        .logo-icon {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
          margin-right: 0.75rem;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-desktop {
          display: none;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .nav-desktop {
            display: flex;
          }
        }

        .nav-link {
          color: #374151;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
        }

        .login-btn {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .mobile-menu-btn {
          display: block;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(156, 163, 175, 0.1);
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        /* Mobile Menu */
        .mobile-menu {
          background: white;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 1rem;
        }

        .mobile-menu-link {
          display: block;
          padding: 0.75rem;
          color: #374151;
          text-decoration: none;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          margin-bottom: 0.25rem;
        }

        .mobile-menu-link:hover {
          color: #2563eb;
          background: rgba(37, 99, 235, 0.05);
        }

        /* Hero Slider */
        .hero-section {
          position: relative;
          padding-top: 5rem;
          background: linear-gradient(135deg, #eff6ff, #e0e7ff);
        }

        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .hero-slider {
          position: relative;
          height: 24rem;
          overflow: hidden;
          border-radius: 1rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        @media (min-width: 1024px) {
          .hero-slider {
            height: 31.25rem;
          }
        }

        .slide {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          transition: all 0.7s ease;
          opacity: 0;
        }

        .slide.active {
          opacity: 1;
        }

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .slide-content {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide-inner {
          max-width: 32rem;
          text-align: center;
          color: white;
          padding: 1.5rem;
        }

        .slide-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 1024px) {
          .slide-title {
            font-size: 3rem;
          }
        }

        .slide-subtitle {
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        @media (min-width: 1024px) {
          .slide-subtitle {
            font-size: 1.25rem;
          }
        }

        .slide-features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .slide-features {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .slide-feature {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
        }

        .slide-btn {
          background: white;
          color: #2563eb;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .slide-btn:hover {
          background: #f9fafb;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .slider-nav:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .slider-nav.prev {
          left: 1rem;
        }

        .slider-nav.next {
          right: 1rem;
        }

        .slider-indicators {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
        }

        .slider-indicator {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.5);
        }

        .slider-indicator:hover {
          background: rgba(255, 255, 255, 0.75);
        }

        .slider-indicator.active {
          background: white;
          transform: scale(1.25);
        }

        /* Stats Section */
        .stats-section {
          padding: 4rem 0;
          background: white;
        }

        .stats-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-item {
          text-align: center;
          padding: 1.5rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 1024px) {
          .stat-number {
            font-size: 3rem;
          }
        }

        .stat-label {
          color: #6b7280;
          font-weight: 500;
        }

        /* Services Section */
        .services-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f9fafb, #f3f4f6);
        }

        .services-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .services-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .services-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        @media (min-width: 1024px) {
          .services-title {
            font-size: 3rem;
          }
        }

        .services-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 32rem;
          margin: 0 auto;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .service-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          border: 1px solid rgba(229, 231, 235, 0.5);
        }

        .service-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }

        .service-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .service-icon {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          color: #2563eb;
          padding: 0.75rem;
          border-radius: 0.75rem;
          margin-right: 1rem;
        }

        .service-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .service-description {
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }

        .service-features {
          margin-bottom: 1.5rem;
        }

        .service-feature {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .service-feature:last-child {
          margin-bottom: 0;
        }

        .service-link {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s ease;
        }

        .service-link:hover {
          color: #1d4ed8;
          transform: translateX(4px);
        }

        /* CTA Section */
        .cta-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }

        .cta-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
          text-align: center;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        @media (min-width: 1024px) {
          .cta-title {
            font-size: 3rem;
          }
        }

        .cta-subtitle {
          font-size: 1.125rem;
          color: #bfdbfe;
          margin-bottom: 2rem;
          max-width: 32rem;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
        }

        @media (min-width: 640px) {
          .cta-buttons {
            flex-direction: row;
          }
        }

        .cta-btn-primary {
          background: white;
          color: #2563eb;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .cta-btn-primary:hover {
          background: #f9fafb;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .cta-btn-secondary {
          background: transparent;
          border: 2px solid white;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cta-btn-secondary:hover {
          background: white;
          color: #2563eb;
          transform: translateY(-2px);
        }

        /* Footer */
        .footer {
          background: #111827;
          color: white;
          padding: 3rem 0;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .footer-brand {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .footer-logo {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
          margin-right: 0.75rem;
        }

        .footer-brand-name {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .footer-description {
          color: #9ca3af;
          line-height: 1.6;
        }

        .footer-section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-link {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: white;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          color: #9ca3af;
        }

        .footer-contact-item svg {
          margin-right: 0.5rem;
        }

        .footer-bottom {
          border-top: 1px solid #374151;
          margin-top: 2rem;
          padding-top: 2rem;
          text-align: center;
          color: #9ca3af;
        }

        .footer-bottom-links {
          margin-top: 0.5rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .footer-bottom-link {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-bottom-link:hover {
          color: white;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: white;
          border-radius: 1rem;
          max-width: 28rem;
          width: 100%;
          padding: 2rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        .modal-close {
          color: #6b7280;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.2s ease;
        }

        .modal-close:hover {
          color: #374151;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #374151;
        }

        .form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
        }

        .checkbox-group input {
          margin-right: 0.5rem;
        }

        .forgot-password {
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #1d4ed8;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .register-link {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .register-link a {
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .register-link a:hover {
          color: #1d4ed8;
        }

        /* Notification */
        .notification {
          position: fixed;
          top: 6rem;
          right: 1rem;
          z-index: 50;
          max-width: 24rem;
          width: 100%;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          animation: notificationSlideIn 0.3s ease-out;
        }

        @keyframes notificationSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .notification.success {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
        }

        .notification.error {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
        }

        .notification.info {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }

        .notification-content {
          display: flex;
          align-items: center;
        }

        .notification-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
          flex-shrink: 0;
        }

        .notification-message {
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Utility Classes */
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .section {
          padding: 4rem 0;
        }

        .text-center {
          text-align: center;
        }

        .hidden {
          display: none;
        }

        /* Responsive Design */
        @media (min-width: 640px) {
          .header-content {
            padding: 0 1.5rem;
          }
          
          .hero-container {
            padding: 0 1.5rem;
          }
          
          .stats-container {
            padding: 0 1.5rem;
          }
          
          .services-container {
            padding: 0 1.5rem;
          }
          
          .cta-container {
            padding: 0 1.5rem;
          }
          
          .footer-container {
            padding: 0 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .header-content {
            padding: 0 2rem;
          }
          
          .hero-container {
            padding: 0 2rem;
          }
          
          .stats-container {
            padding: 0 2rem;
          }
          
          .services-container {
            padding: 0 2rem;
          }
          
          .cta-container {
            padding: 0 2rem;
          }
          
          .footer-container {
            padding: 0 2rem;
          }
        }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Focus Styles */
        button:focus,
        input:focus,
        a:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        /* Loading States */
        .loading {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Hover Effects */
        .hover-lift {
          transition: transform 0.2s ease;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
        }

        /* Gradient Backgrounds */
        .gradient-blue {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }

        .gradient-gray {
          background: linear-gradient(135deg, #f9fafb, #f3f4f6);
        }

        .gradient-dark {
          background: linear-gradient(135deg, #111827, #1f2937);
        }
      `}</style>

      {/* Header */}
      <header className={`header ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="logo-text">MyBank</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="nav-desktop">
              {['Personal Banking', 'Business Banking', 'Loans', 'Investments', 'Support'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="nav-link"
                  onClick={() => showNotification(`${item} section loading...`)}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="login-btn hidden md:block"
              >
                Login
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mobile-menu-btn"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="space-y-1">
              {['Personal Banking', 'Business Banking', 'Loans', 'Investments', 'Support'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="mobile-menu-link"
                  onClick={() => {
                    setIsMenuOpen(false);
                    showNotification(`${item} section loading...`);
                  }}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowLoginModal(true);
                }}
                className="mobile-menu-link w-full text-left font-medium text-blue-600"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Slider */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-slider">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="slide-overlay"></div>
                <div className="slide-content">
                  <div className="slide-inner">
                    <h2 className="slide-title">
                      {slide.title}
                    </h2>
                    <p className="slide-subtitle">
                      {slide.subtitle}
                    </p>
                    <div className="slide-features">
                      {slide.features.map((feature, i) => (
                        <div key={i} className="slide-feature">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handleSlideAction(slide.action)}
                      className="slide-btn"
                    >
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={() => moveSlide(-1)}
              className="slider-nav prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => moveSlide(1)}
              className="slider-nav next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="slider-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">
                  {stat.number}
                </div>
                <div className="stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <div className="services-header">
            <h2 className="services-title">
              Our Banking Services
            </h2>
            <p className="services-subtitle">
              Comprehensive financial solutions designed to meet your personal and business needs
            </p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <div className="service-icon">
                    {service.icon}
                  </div>
                  <h3 className="service-title">
                    {service.title}
                  </h3>
                </div>
                <p className="service-description">
                  {service.description}
                </p>
                <div className="service-features">
                  {service.features.map((feature, i) => (
                    <div key={i} className="service-feature">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                <a
                  href="#"
                  onClick={() => showNotification(`${service.title} details loading...`)}
                  className="service-link"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to Experience Better Banking?
          </h2>
          <p className="cta-subtitle">
            Join millions of satisfied customers who trust us with their financial needs
          </p>
          <div className="cta-buttons">
            <button
              onClick={() => navigate('/banking-portal')}
              className="cta-btn-primary"
            >
              Open Account
            </button>
            <button
              onClick={() => showNotification('Contact form opening...')}
              className="cta-btn-secondary"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="footer-logo">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="footer-brand-name">MyBank</h3>
              </div>
              <p className="footer-description">
                Your trusted banking partner providing secure and innovative financial solutions.
              </p>
            </div>
            
            <div>
              <h4 className="footer-section-title">Services</h4>
              <div className="footer-links">
                {['Personal Banking', 'Business Banking', 'Loans', 'Investments'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="footer-link"
                    onClick={() => showNotification(`${item} page loading...`)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="footer-section-title">Support</h4>
              <div className="footer-links">
                {['Help Center', 'Contact Us', 'Branch Locator', 'Security'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="footer-link"
                    onClick={() => showNotification(`${item} page loading...`)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="footer-section-title">Contact</h4>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <Phone className="w-5 h-5" />
                  1800-123-4567
                </div>
                <div className="footer-contact-item">
                  <Mail className="w-5 h-5" />
                  support@mybank.com
                </div>
                <div className="footer-contact-item">
                  <Clock className="w-5 h-5" />
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 MyBank. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <span>|</span>
              <a href="#" className="footer-bottom-link">Security</a>
            </div>
          </div>
        </div>
      </footer>

     

      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <CheckCircle className="notification-icon" />
            <span className="notification-message">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalBankingWebsite;
