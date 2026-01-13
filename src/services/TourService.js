import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

/* eslint-disable class-methods-use-this */
class TourService {
  constructor() {
    this.driver = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: 'Finish',
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      onHighlightStarted: (element) => {
        if (!element) return;
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
    });

    this.steps = [
      {
        element: '#app-header',
        popover: {
          title: 'Welcome to AgriBackup! 👋',
          description: 'This quick tour will show you around the key features of your dashboard.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        element: '.modern-drawer',
        popover: {
          title: 'Navigation Menu',
          description: 'Use the sidebar to access your Dashboard, Production Units, Documents, and other key sections.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '#global-command-palette',
        popover: {
          title: 'Smart Command Palette 🧠',
          description: 'Press <kbd>Ctrl+K</kbd> or click here to search for pages, or ask our <b>AI Copilot</b> for help!',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '#header-notification-btn',
        popover: {
          title: 'Notifications 🔔',
          description: 'Stay updated with important alerts, compliance notices, and messages here.',
          side: 'bottom',
          align: 'end',
        },
      },
      {
        element: '#header-profile-menu',
        popover: {
          title: 'Profile & Settings ⚙️',
          description: 'Manage your account, switch roles, or adjust settings from this menu.',
          side: 'left',
          align: 'end',
        },
      },
      {
        element: '#tour-help-btn',
        popover: {
          title: 'Need Help? ℹ️',
          description: 'You can restart this tour anytime from here. Happy farming! 🚜',
          side: 'bottom',
          align: 'end',
        },
      },
    ];
  }

  startTour(userRole = null) {
    const finalSteps = [...this.steps];

    // Insert role-specific steps before the last step (Help button)
    const roleSteps = [];

    if (userRole) {
      const roleStr = String(userRole).toUpperCase();

      if (roleStr.includes('FARMER')) {
        roleSteps.push({
          element: '.modern-drawer', // Ideally, target specific list item if possible
          popover: {
            title: 'My Production Units 🌿',
            description: 'This is where you manage your land, crops, and harvest logs.',
            side: 'right',
            align: 'start',
          },
        });
      } else if (roleStr.includes('EXPORTER') || roleStr.includes('VERIFIER')) {
        roleSteps.push({
          element: '.modern-drawer',
          popover: {
            title: 'EUDR Compliance 🇪🇺',
            description: 'Track due diligence statements and risk assessments here.',
            side: 'right',
            align: 'start',
          },
        });
      }
    }

    // Insert role steps before the last "Help" step
    if (roleSteps.length > 0) {
      finalSteps.splice(finalSteps.length - 1, 0, ...roleSteps);
    }

    this.driver.setSteps(finalSteps);
    this.driver.drive();
  }

  hasSeenTour() {
    return localStorage.getItem('hasSeenOnboardingTour') === 'true';
  }

  markTourAsSeen() {
    localStorage.setItem('hasSeenOnboardingTour', 'true');
  }
}

export default new TourService();
