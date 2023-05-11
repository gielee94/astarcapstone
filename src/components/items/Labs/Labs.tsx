import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
import './Labs.css'

const Labs: React.FC = () => {
  const labs = useSelector((state: AppState) => state.labs.data);

  return (
    <div className='labContainer'>
      {labs && labs.map((lab) => (
        <div key={lab.labPlanId.subscriptionId} className="labData-item">
        <p>{lab.title}</p>
        <p>{lab.virtualMachineProfile.createOption === 1 ? 'Customizable' : 'Non-customizable'}</p>
        <p>{lab.virtualMachineProfile.imageReference.offer}</p>
        <p>rg: {lab.labPlanId.parent.resourceGroupName}</p>
        <p>subscription: {lab.labPlanId.subscriptionId}</p>
        <p>labplan: {lab.labPlanId.name}</p>
        <p>SKU Name: {lab.virtualMachineProfile.sku.name}</p>
        <p>Hours: {lab.virtualMachineProfile.usageQuota.substring(0, 2)}</p>
        
      </div>
      ))}
    </div>
  );
};

export default Labs;