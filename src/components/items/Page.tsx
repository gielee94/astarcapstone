import React, { useEffect, useState } from 'react';
import './Page.css';
import { useIsAuthenticated } from '@azure/msal-react';
import { SigninButton } from './Navbar/SignIn';

import Labs from './Labs/Labs';
import ACG from './Category/acg';
import Category from './Category/Cateogory';
import Footer from './Footer/Footer';

import { AppState } from '../redux/types';
import { useSelector } from 'react-redux';
const Page: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(true);
  const [hasLabPlan, setHasLabPlan] = useState(false);
  const labplans = useSelector((state: AppState) => state.labPlans.data);
  const rgs = useSelector((state: AppState) => state.rgs.data);
  const [selectedRG, setSelectedRG] = useState('');
  const [labPlanTitle, setLabPlanTitle] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      // Send a backend request to get user resource data
      // Update the hasSubscription and hasLabPlan states based on the response
      // Set isLoading to false once the data has been fetched
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  
  useEffect(() => {
    if (labplans !== null && labplans.length > 0) {
      setHasLabPlan(true);
    } else {
      setHasLabPlan(false);
    }
  }, [labplans]);
  
  

  const renderContent = () => {
    

    if (!isAuthenticated) {
      return (
        <div>
          <h1>Welcome to Azure Lab Services</h1>
          <p>
            Azure Lab Services enable you to easily set up a class, run a training
            lab, host a hackathon, experiment, and test your proof-of-concept ideas
            in the cloud.
          </p>
          <p>
            Already a user? <SigninButton />
          </p>
        </div>
      );
    }

    if (!hasSubscription) {
      return <div>In order to use Azure Lab Service,
        You need subscrtipion.
        <a>https://azure.microsoft.com/en-us/free/</a>
      </div>;
    }

    if (!hasLabPlan) {
      return (
        <div className="app-container">
        <div className="no-lab-plan-container">
          <h2>Looks like you don't have a lab plan</h2>
    
          <p>Please fill out:</p>
    
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="resourceGroup">Resource Group:</label>
              {rgs ? (
                <select
                  id="resourceGroup"
                  className="resource-group-dropdown"
                  value={selectedRG}
                  onChange={(e) => setSelectedRG(e.target.value)}
                >
                  <option value="">Select a resource group</option>
                  {rgs.map((rg) => (
                    <option key={rg.id} value={rg.name}>
                      {rg.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="resourceGroup"
                  className="resource-group-input"
                  value={selectedRG}
                  onChange={(e) => setSelectedRG(e.target.value)}
                />
              )}
            </div>
    
            <div className="form-group">
              <label htmlFor="labPlanTitle">Lab Plan Title:</label>
              <input
                type="text"
                id="labPlanTitle"
                className="lab-plan-title-input"
                value={labPlanTitle}
                onChange={(e) => setLabPlanTitle(e.target.value)}
              />
            </div>
    
            <div className="form-group">
              <label htmlFor="region">Region:</label>
              <select
                id="region"
                className="region-dropdown"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Select a region</option>
                {[1, 2, 3, 4, 5].map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <button
                type="submit"
                className="submit-button"
                onClick={() => {
                  // Implement your submit functionality here
                }}
              >
                Submit
              </button>
            </div>
          </div>
          
        </div>
        </div>
      );
    }
    

    return (
      <div>
        <Labs />
        <ACG />
        <Category />
      </div>
    );
  };

  return <div>{renderContent()}
  <Footer />
  </div>;
};

export default Page;
