import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
import GetImage from '../../hook/image';
import useCreate from '../../hook/labCreate';
import axios from "axios";
import './Popup.css';

interface PopupProps {
  show: boolean;
  item: any;
  handleClose: () => void;
}
type AllowedRegion = {
  name: string;
  displayName: string;
};
const Popup: React.FC<PopupProps> = ({ show, item, handleClose }) => {

  const labplans = useSelector((state: AppState) => state.labPlans.data);
  const accessToken = useSelector((state: AppState) => state.token.accessToken);
  const [labTitle, setLabTitle] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState('');
  const [isCustomizeChecked, setIsCustomizeChecked] = useState(false);
  const [selectedLP, setselectedLP] = useState('');
  const selectedLabPlan = labplans?.find((labplan) => labplan.id.name === selectedLP);
  const allowedRegions = selectedLabPlan?.data.allowedRegions || [];
  const [selectedRegion, setSelectedRegion] = useState('');


  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };
  const [showContent2, setShowContent2] = useState(false);
  const handleLPChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedLP(event.target.value);
  };
  const [csvData, setCsvData] = useState<string | null>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCsvData(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleNextClick = () => {
    setShowContent2(true);
  };

  const handleBackClick = () => {
    setShowContent2(false);
  };


  useEffect(() => {
    if (!show) {
      setLabTitle('');
      setLogin('');
      setPassword('');
      setStudents('');
      setIsCustomizeChecked(false);
      setShowContent2(false);
      setselectedLP('');
      setSelectedRegion('');
      setCsvData('');
      
    }
  }, [show]);
  
  

  
  const apiData = accessToken && labplans ? GetImage(item, accessToken, labplans) : null;


  const [submitClicked, setSubmitClicked] = useState(false);
  const handleSubmit = () => {
    setSubmitClicked(true);
  };

  useCreate({
    submitClicked,
    accessToken,
    apiData,
    labplans,
    selectedLP,
    labTitle,
    login,
    password,
    students,
    isCustomizeChecked,
  })



  return (
    <div className={`popup ${show ? "popup-show" : ""}`} onClick={handleBackgroundClick}>
      <div className="popup-content" style={{ display: showContent2 ? "none" : "block" }}>
        <div className="popup-header">
          <img src={apiData?.data.iconUri} alt={item.title} />
          <button className="popup-close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="popup-body">
          <h1>{apiData?.data.author}</h1>
          <h2>{item?.title}</h2>
          <p>{item?.identifier}</p>
          <p dangerouslySetInnerHTML={{ __html: apiData?.data.description }}></p>
        </div>
        
          <select onChange={handleLPChange}>
          <option value="">Select a lab plan</option>
            {labplans?.map((labplan) => (
              <option key={labplan.id.name} value={labplan.id.name}>
                {labplan.id.name}
              </option>
            ))}
          </select>
          <div>
              <p><label>Lab Title: <input type="text" value={labTitle} onChange={(e) => setLabTitle(e.target.value)} /></label></p>
              <p>Region:
                {allowedRegions.length === 1 ? (
                  <span>{allowedRegions[0].displayName}</span>
                ) : (
                  <select onChange={handleRegionChange}>
                    <option value="">Select a region</option>
                    {allowedRegions.map((region: AllowedRegion, index: number) => (
                      <option key={index} value={region.name}>
                        {region.displayName}
                      </option>
                    ))}
                  </select>
                )}
              </p>


              <p><label>Login: <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} /></label></p>
              <p><label>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label></p>
              <p><label>Students: <input type="text" value={students} onChange={(e) => setStudents(e.target.value)} /></label></p>
            </div>
            <div className="customize-section">
              <p className="customize-text">Customize?</p>
              <div className="radio-buttons">
                <label className="radio-label">
                  <input type="radio" value="yes" checked={isCustomizeChecked} onChange={() => setIsCustomizeChecked(true)} />
                  Yes
                </label>
                <label className="radio-label">
                  <input type="radio" value="no" checked={!isCustomizeChecked} onChange={() => setIsCustomizeChecked(false)} />
                  No
                </label>
              </div>
            </div>

            <button className="popup-next" onClick={handleNextClick}
            disabled={!labTitle || !login || !password || !students || !selectedLP}>
          Next
        </button>
          
      </div>
      <div className="popup-content2" style={{ display: showContent2 ? "block" : "none" }}>
        <div className="popup-header">
          <h2>User Invitation</h2>
          <button className="popup-close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <button className="popup-close" onClick={handleClose}></button>
        <div className="email-list-container">
        <label htmlFor="emailList">Email List:</label>
        <textarea
          id="emailList"
          value={csvData || ""}
          placeholder="Paste a list of emails here..."
          onChange={(e) => setCsvData(e.target.value)}
        />
      </div>
      <div className="csv-file-container">
      <label htmlFor="csvFile">CSV File:</label>
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileUpload}
      />
    </div>
        <button className="popup-back" onClick={handleBackClick}>
          Back
        </button>
        <p>If you want to invite user urself please click slip</p>
        <p>You would have to publish and invite user urself</p>
        <button className="submit-button skip">Skip</button>

        <button className="submit-button">Skip</button>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
        <p>{csvData? csvData : null}</p>
      </div>
    </div>
  );
};

export default Popup;
