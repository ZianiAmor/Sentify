import React, { useEffect } from 'react';
import Card from './Card';
import './css/MainContent.css';
import TopBar from './TopBar';

import MoodInsightsIcon from '../assets/icons/insights.svg';
import MoodTriggersIcon from '../assets/icons/triggers.svg';
import MoodMirrorIcon from '../assets/icons/mirror.svg';

import MoodEntriesThumb from '../assets/images/enteries.jpg';
import MoodInsightsThumb from '../assets/images/insights.jpg';
import MoodTriggersThumb from '../assets/images/triggers.jpg';
import MoodMirrorThumb from '../assets/images/mirror.jpg';

import MoodEntries from './subsections/Mood/YourEnteries';
import MoodInsights from './subsections/Mood/Insights';
import MoodTriggers from './subsections/Mood/TriggersHistory';
import MoodMirror from './subsections/Mood/MoodMirror';

const MainContent = ({ activeMain, activeSub, setActiveSub, user }) => {
  const sections = {
    mood: {
      title: "Mood",
      subtitle: "Your Emotional Compass",
      subs: [
        { 
          id: "entries", 
          label: "Your Entries", 
          icon: null, 
          description: "Track and reflect on your daily emotional journey",
          thumbnail: MoodEntriesThumb,
          component: <MoodEntries user={user} />,
          isMain: true // This makes it the large featured card like enteries in mood
        },
        { 
          id: "insights", 
          label: "Insights", 
          icon: MoodInsightsIcon,
          description: "Visualize your emotional rhythm. Track your mood trends",
          thumbnail: MoodInsightsThumb,
          component: <MoodInsights user={user} />,
          isMain: false
        },
        { 
          id: "triggers", 
          label: "Trigger History", 
          icon: MoodTriggersIcon,
          description: "Identify what lifts you up or weighs you down. Gain control over your emotional cycles",
          thumbnail: MoodTriggersThumb,
          component: <MoodTriggers user={user} />,
          isMain: false
        },
        { 
          id: "mirror", 
          label: "Mood Mirror", 
          icon: MoodMirrorIcon,
          description: "View a visual reflection of your recent mood trends. This avatar adapts to your emotional data from the past week",
          thumbnail: MoodMirrorThumb,
          component: <MoodMirror user={user} />,
          isMain: false
        }
      ]
    },
    school: {
      title: "School",
      subtitle: "Your Academic Hub", 
      subs: [
        // Add school subsections here when ready
      ]
    },
    explore: {
      title: "Explore",
      subtitle: "Discover New Horizons",
      subs: [
        // Add explore subsections here when ready
      ]
    }
  };

  useEffect(() => {
    setActiveSub(null);
  }, [activeMain, setActiveSub]);

  const currentSection = sections[activeMain];
  
  if (!currentSection) {
    return <div className="main-content">Select a section from the sidebar to show content</div>;
  }

  // If a subsection is active, show its component
  if (activeSub) {
    const activeSubSection = currentSection.subs.find(sub => sub.id === activeSub);
    if (activeSubSection) {
      return (
        <div className="main-content">
          <div className="content-header-minimal">
           <button 
          className="back-arrow-float"
          onClick={() => setActiveSub(null)}
          title={`Back to ${currentSection.title}`}
        >
          ←
        </button>
      </div>
          <div className="component-content">
            {activeSubSection.component}
          </div>
        </div>
      );
    }
  }

  // Otherwise, show the cards grid
  return (
    <div className="main-content">
            <TopBar subtitle={currentSection.subtitle} />
      
      <div className="cards-container">
        {currentSection.subs.map((sub) => (
          <Card
            key={sub.id}
            title={sub.label}
            description={sub.description}
            icon={sub.icon}
            thumbnail={sub.thumbnail}
            onClick={() => setActiveSub(sub.id)}
            className={sub.isMain ? 'card-main' : 'card-regular'}
          />
        ))}
      </div>
    </div>
  );
};

export default MainContent;