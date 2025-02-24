import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './SurveyForm.css'; // Form styling
import RankedChoice from './RankedChoice';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  "https://aqvtfsfnhtdviffdwkyz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdnRmc2ZuaHRkdmlmZmR3a3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMjk3MTAsImV4cCI6MjA1NTYwNTcxMH0.smDWB8S5nugK9owKzD_SowdNvEUs03nnsbLkLMndC5s"
);

const WorkSurvey = () => {
  const [formData, setFormData] = useState({
    // Biographic fields
    fullName: '',
    email: '',
    // Personal section keys
    personalGoals: '',
    personalOpportunities: '',
    challenges: [],
    otherChallenge: '',
    tools: [],
    otherTool: '',
    toolsLacking: '',
    toolFeatures: [],
    // otherFeature: '',
    motivation: [],
    // otherMotivation: '',
    goalsRanking: [
      'Mastering your personal productivity',
      'Creating unforgettable social moments',
      'Keeping track of meaningful details effortlessly',
      'Discovering new opportunities you never considered',
      'Simplifying your day-to-day tasks'
    ],
    // Work section keys
    workInterest: '', // Yes/No answer for work interest
    professionalGoals: '',
    workType: '',
    otherWorkType: '',
    industry: '', 
    otherIndustry: '',
    numberOfEmployees: '',
    experienceYears: '',
    workTools: [],
    otherWorkTool: '',
    workToolsLacking: '',
    workFactors: [],
    otherWorkFactor: '',
    workHelpRanking: [
      'Never forgetting key insights from meetings, conversations, and ideas',
      'Making it easier to prepare for meetings and important tasks',
      'Helping me organize and structure my thinking effortlessly',
      'Connecting the dots between different projects, people, and insights',
      'Reducing time spent on admin and manual organization'
    ],
    workCompetitiveEdge: '',
    personalInterest: '',
  });

  // Determine final section based on whether personal survey is included.
  // TODO: Update finalSection logic based on branching (work only vs. work + personal)
  const finalSection = formData.completePersonal ? 17 : 10;

  const [currentSection, setCurrentSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calculate progress (0% to 100%)
  const progressPercent = Math.round((currentSection / finalSection) * 100);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => {
        const currentValues = prev[name] || [];
        return { ...prev, [name]: checked ? [...currentValues, value] : currentValues.filter((v) => v !== value) };
      });
    } else if (name === 'challenges' || name === 'toolFeatures' || name === 'motivation') {
      // Split comma-separated values and trim whitespace
      setFormData((prev) => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate required fields for each section based on new ordering
  const validateCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return formData.fullName && formData.email;
      case 1:
        return formData.professionalGoals;
      case 2:
        return formData.workType && formData.industry.length > 0 && formData.numberOfEmployees;
      case 3:
        return formData.experienceYears;
      case 4:
        return formData.workTools.length > 0;
      case 5:
        return formData.workToolsLacking;
      case 6:
        return formData.workFactors.length > 0;
      case 7:
        return formData.workHelpRanking.length > 0;
      case 8:
        return formData.workCompetitiveEdge;
      case 9:
        return true; // Personal survey opt-in screen; no input required here
      case 10:
        return formData.personalGoals && formData.personalOpportunities;
      case 11:
        return formData.challenges.length > 0;
      case 12:
        return formData.tools.length > 0;
      case 13:
        return formData.toolFeatures.length > 0;
      case 14:
        return formData.motivation.length > 0;
      case 15:
        return formData.goalsRanking.length > 0;
      default:
        return true;
    }
  };

  const nextSection = () => {
    if (validateCurrentSection()) {
      if (currentSection === 9 && !formData.completePersonal) {
        // If the current section is the personal survey option and the user chose "No",
        // skip to the final section for submission
        setCurrentSection(finalSection);
      } else if (currentSection < finalSection) {
        setCurrentSection(currentSection + 1);
      }
    } else {
      alert("Please fill out all required fields before proceeding.");
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentSection()) {
      alert("Please fill out all required fields before submitting.");
      return;
    }

    // Convert arrays to JSON strings before submission
    const submissionData = {
      full_name: formData.fullName || "Not submitted",
      email: formData.email || "Not submitted",
      work_interest: formData.workInterest || "Used Work entry point",
      industry: formData.industry.length > 0 ? JSON.stringify(formData.industry) : "Not submitted",
      other_industry: formData.otherIndustry || "Not submitted",
      experience_years: formData.experienceYears || "Not submitted",
      number_of_employees: formData.numberOfEmployees || "Not submitted",
      professional_goals: formData.professionalGoals || "Not submitted",
      personal_goals: formData.personalGoals || "Not submitted",
      personal_opportunities: formData.personalOpportunities || "Not submitted",
      work_type: formData.workType || "Not submitted",
      tools: JSON.stringify(formData.tools) || "Not submitted",
      tools_lacking: formData.toolsLacking || "Not submitted",
      other_tool: formData.otherTool || "Not submitted",
      other_work_tool: formData.otherWorkTool || "Not submitted",
      challenges: JSON.stringify(formData.challenges) || "Not submitted",
      motivation: JSON.stringify(formData.motivation) || "Not submitted",
      work_factors: JSON.stringify(formData.workFactors) || "Not submitted",
      work_help_ranking: JSON.stringify(formData.workHelpRanking) || "Not submitted",
      goals_ranking: JSON.stringify(formData.goalsRanking) || "Not submitted",
      created_at: new Date().toISOString(),
      personal_interest: formData.personalInterest || "Not submitted",
    };

    const { data, error } = await supabase
      .from("form_responses")
      .insert([submissionData]);

    if (error) {
      console.error("Supabase Error:", error.message);
      // Optionally handle error display here
    } else {
      console.log("Success:", data);
      setShowConfirmation(true);
    }
  };

  const renderSection = () => {
    if (showConfirmation) {
      return (
        <div>
          Your responses have been recorded, and you're now on the waitlist for Kairos!
          <br /><br />
          You're officially one step closer to achieving your loftiest goals.
          <br /><br />
          We'll be in touch soon!
        </div>
      );
    }

    switch (currentSection) {
      case 0:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Biographic Information</h2>
            <label>
              <strong>Full Name: *</strong>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Email Address: *</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
          </section>
        );
      case 1:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Professional Goals</h2>
            <label>
              <strong>What are your professional goals for the next year? *</strong>
              <span className="tooltip-container">
                &#9432;
                <span className="tooltip">
                  What do you want to accomplish in your career or work life? This could be about growth, efficiency, networking, leadership, or something else.
                </span>
              </span>
              <input
                type="text"
                name="professionalGoals"
                value={formData.professionalGoals}
                onChange={handleChange}
              />
            </label>
          </section>
        );
    case 2:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Work Role and Industry</h2>
            <label>
              <strong>What kind of work do you do? (Select the closest match) *</strong>
              {[
                'Executive / Leadership',
                'Entrepreneur / Business Owner',
                'Product Management',
                'Engineering / Technical',
                'Marketing / Sales',
                'Operations / Project Management',
                'Consulting / Freelance',
                'Creative / Design',
                'Academia / Research',
                'Other'
              ].map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    name="workType"
                    value={option}
                    checked={formData.workType === option}
                    onChange={handleChange}
                  />
                  {option}
                </div>
              ))}
            </label>
            {formData.workType === 'Other' && (
              <label>
                Please specify:
                <input
                  type="text"
                  name="otherWorkType"
                  value={formData.otherWorkType}
                  onChange={handleChange}
                />
              </label>
            )}
            <label>
              <strong>What industry do you work in? (Select all that apply) *</strong>
              {[
                'Technology',
                'Finance',
                'Healthcare',
                'Education',
                'Retail',
                'Manufacturing',
                'Other'
              ].map((option) => (
                <div key={option}>
                  <input
                    type="checkbox"
                    name="industry"
                    value={option}
                    checked={formData.industry.includes(option)}
                    onChange={handleChange}
                  />
                  {option}
                </div>
              ))}
            </label>
            {formData.industry.includes('Other') && (
              <label>
                Please specify:
                <input
                  type="text"
                  name="otherIndustry"
                  value={formData.otherIndustry}
                  onChange={handleChange}
                />
              </label>
            )}
            <label>
              <strong>How many employees are at your company? *</strong>
              {['1-10', '11-50', '51-100', '101-500', '500+'].map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    name="numberOfEmployees"
                    value={option}
                    checked={formData.numberOfEmployees === option}
                    onChange={handleChange}
                  />
                  {option}
                </div>
              ))}
            </label>
          </section>
        );
    case 3:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Experience</h2>
            <label>
              <strong>How many years of work experience do you have? *</strong>
              {['0-2 years', '3-5 years', '6-10 years', '11+ years'].map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="experienceYears"
                    value={option}
                    checked={formData.experienceYears === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              ))}
            </label>
          </section>
        );
      case 4:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Work Tools</h2>
            <label>
              <strong>What tools do you currently use to stay organized at work? *</strong>
              {[
                'Notion',
                'Google Docs / Google Drive',
                'Microsoft OneNote',
                'Evernote',
                'Asana',
                'Trello',
                'Monday.com',
                'Obsidian',
                'Roam Research',
                "I don't use any specific tools",
                'Other'
              ].map((option) => (
                <div key={option}>
                  <input
                    type="checkbox"
                    name="workTools"
                    value={option}
                    checked={formData.workTools.includes(option)}
                    onChange={handleChange}
                  />
                  {option}
                </div>
              ))}
            </label>
            {formData.workTools.includes('Other') && (
              <label>
                Please specify:
                <input
                  type="text"
                  name="otherWorkTool"
                  value={formData.otherWorkTool}
                  onChange={handleChange}
                />
              </label>
            )}
          </section>
        );
      case 5:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Tool Shortcomings</h2>
            <label>
              <strong>What do you find lacking in your current work tools? *</strong>
              <input
                type="text"
                name="workToolsLacking"
                value={formData.workToolsLacking}
                onChange={handleChange}
              />
            </label>
          </section>
        );
      case 6:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Selection Factors</h2>
            <label>
              <strong>What are the most important factors in choosing an organizational tool for work? (Select up to 3) *</strong>
              {[
                'Works well for team collaboration',
                'Integrates with other tools we use (Slack, Google Drive, etc.)',
                'Helps me stay personally organized and efficient',
                'Secure and compliant with company policies',
                'Easy to use and doesn\'t require much setup',
                'Scales well as my workload grows',
                'Provides useful automation or AI features',
                'Other',
              ].map((option) => (
                <div key={option}>
                  <input
                    type="checkbox"
                    name="workFactors"
                    value={option}
                    checked={formData.workFactors.includes(option)}
                    onChange={handleChange}
                  />
                  {option}
                </div>
              ))}
            </label>
            {formData.workFactors.includes('Other') && (
              <label>
                Please specify:
                <input
                  type="text"
                  name="otherWorkFactor"
                  value={formData.otherWorkFactor}
                  onChange={handleChange}
                />
              </label>
            )}
          </section>
        );
      case 7:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Work Impact Ranking</h2>
            <label>
              <strong>What would you like Kairos to help you with the most at work? (Drag and drop to reorder) *</strong>
            </label>
            <RankedChoice
              items={formData.workHelpRanking}
              setItems={(newOrder) =>
                setFormData((prev) => ({ ...prev, workHelpRanking: newOrder }))
              }
            />
          </section>
        );
      case 8:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Competitive Edge</h2>
            <label>
              <strong>If Kairos gave you a competitive edge at work, what would you accomplish? *</strong>
              <input
                type="text"
                name="workCompetitiveEdge"
                value={formData.workCompetitiveEdge}
                onChange={handleChange}
              />
            </label>
          </section>
        );
      case 9:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Kairos Personal Opt-In</h2>
            <label>
              <strong>Would also like to explore how Kairos can help in your personal life? *</strong>
              <select
                name="personalInterest"
                value={formData.personalInterest ? "Yes" : "No"}
                onChange={(e) => {
                  const value = e.target.value === "Yes";
                  setFormData((prev) => ({ ...prev, completePersonal: value }));
                  if (!value) {
                    // Skip to submission (final screen) if "No" is selected
                    setCurrentSection(finalSection);
                  }
                }}
              >
                <option value="Yes">Yes, I want to explore how Kairos can help me in my personal life!</option>
                <option value="No">No thanks, I'm good.</option>
              </select>
            </label>
          </section>
        );
      case 10:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Personal Goals</h2>
            <label>
              <strong>What are your top personal goals for the next year? *</strong>
              <span className="tooltip-container">
                &#9432;
                <span className="tooltip">
                  Think about areas like personal growth, health, relationships, creativity, or productivity.
                </span>
              </span>
              <input
                type="text"
                name="personalGoals"
                value={formData.personalGoals}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>What opportunities are you most excited about in your personal life? *</strong>
              {/* TODO: Update tooltip text for personal opportunities if needed */}
              <input
                type="text"
                name="personalOpportunities"
                value={formData.personalOpportunities}
                onChange={handleChange}
              />
            </label>
          </section>
        );
      case 11:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Challenges</h2>
            <label>
              <strong>What is keeping you from achieving your personal goals? *</strong>
              <span className="tooltip-container">
                &#9432;
                <span className="tooltip">
                  Highlight anything keeping you from achieving your goals.
                </span>
              </span>
              <input
                type="text"
                name="challenges"
                value={formData.challenges.join(', ')}
                onChange={handleChange}
              />
            </label>
            {formData.challenges.includes('Other') && (
              <label>
                Please specify:
                <input
                  type="text"
                  name="otherChallenge"
                  value={formData.otherChallenge}
                  onChange={handleChange}
                />
              </label>
            )}
          </section>
        );
      case 12:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Tools and Preferences</h2>
            <label>
              <strong>How do you stay organized in your personal life? *</strong>
              {[
                "Apple Notes",
                "Google Keep/Drive",
                "Notion",
                "Evernote",
                "Todoist",
                "Things 3",
                "Microsoft OneNote",
                "Pen & Paper",
                "I don't really use any tools",
                "Other"
              ].map((option) => (
                <div key={option}>
                  <input
                    type="checkbox"
                    name="tools"
                    value={option}
                    checked={formData.tools.includes(option)}
                    onChange={handleChange}
                  />
                  {option}
                </div>
              ))}
            </label>
            {formData.tools.includes('Other') && (
              <label>
                Please specify:
                <input
                  type="text"
                  name="otherTool"
                  value={formData.otherTool}
                  onChange={handleChange}
                />
              </label>
            )}
            <label>
              <strong>What do you find lacking in these personal tools? *</strong>
              <span className="tooltip-container">
                &#9432;
                <span className="tooltip">
                  This can be anything that you think is missing from your tools, things that bother you, or any other shortcomings about the current tools you use.
                </span>
              </span>
              <input
                type="text"
                name="toolsLacking"
                value={formData.toolsLacking}
                onChange={handleChange}
              />
            </label>
          </section>
        );
      case 13:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Tool Features</h2>
            <label>
              <strong>What aspects of your current personal tools do you love the most? *</strong>
              <input
                type="text"
                name="toolFeatures"
                value={formData.toolFeatures.join(', ')}
                onChange={handleChange}
              />
            </label>
            {formData.toolFeatures.includes('Other') && (
              <label>
                Please specify:
                <input
                  type="text"
                  name="otherFeature"
                  value={formData.otherFeature}
                  onChange={handleChange}
                />
              </label>
            )}
          </section>
        );
      case 14:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Motivation</h2>
            <label>
              <strong>What helps you stay motivated to achieve your personal goals? *</strong>
              <input
                type="text"
                name="motivation"
                value={formData.motivation.join(', ')}
                onChange={handleChange}
              />
            </label>
            {formData.motivation.includes('Other') && (
              <label>
                Please specify:
                <input
                  type="text"
                  name="otherMotivation"
                  value={formData.otherMotivation}
                  onChange={handleChange}
                />
              </label>
            )}
          </section>
        );
        case 15:
        return (
          <section className="w-full max-w-md mx-auto">
            <h2>Personal Goals Ranking</h2>
            <label>
              <strong>Which of these personal goals would you most like to achieve in the next year? (Drag and drop to reorder) *</strong>
            </label>
            <RankedChoice
              items={formData.goalsRanking}
              setItems={(newOrder) =>
                setFormData((prev) => ({ ...prev, goalsRanking: newOrder }))
              }
            />
          </section>
        );
      default:
        return <div>Thank you for completing the survey!</div>;
    }
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        {renderSection()}

        {!submitted && !showConfirmation && (
          <div className="navigation-buttons">
            <button
              type="button"
              disabled={currentSection === 0}
              onClick={prevSection}
              style={{ opacity: currentSection === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>
            {currentSection === finalSection ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!validateCurrentSection()}
                style={{ opacity: validateCurrentSection() ? 1 : 0.5 }}
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={nextSection}
                disabled={!validateCurrentSection()}
                style={{ opacity: validateCurrentSection() ? 1 : 0.5 }}
              >
                {currentSection === 9 && !formData.completePersonal ? "Submit" : "Next"}
              </button>
            )}
          </div>
        )}
      </form>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Note indicating required fields */}
      {!showConfirmation && (
        <div className="required-note">
          <p>* Required fields</p>
        </div>
      )}

      {/* Initialize tooltips */}
      {/* TODO: Update tooltip initializations if necessary to reflect the new survey flow */}
      <Tooltip id="personalGoalsTip" place="top" effect="solid" className="tooltip" />
      <Tooltip id="personalOpportunitiesTip" place="top" effect="solid" className="tooltip" />
      <Tooltip id="challengesTip" place="top" effect="solid" className="tooltip" />
      <Tooltip id="toolsLackingTip" place="top" effect="solid" className="tooltip" />
      <Tooltip id="toolFeaturesTip" place="top" effect="solid" className="tooltip" />
      <Tooltip id="motivationTip" place="top" effect="solid" className="tooltip" />
      <Tooltip id="goalsTip" place="top" effect="solid" className="tooltip" />
      <Tooltip id="workInterestTip" place="top" effect="solid" className="tooltip" />
      <Tooltip id="professionalGoalsTip" place="top" effect="solid" className="tooltip" />
    </>
  );
};

export default WorkSurvey;