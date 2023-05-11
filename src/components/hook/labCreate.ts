import { useEffect } from 'react';
import axios from 'axios';

type UseCreateProps = {
  submitClicked: boolean;
  accessToken: string | null;
  apiData: any;
  labplans: any[] | null;
  selectedLP: string | null;
  labTitle: string | null;
  login: string;
  password: string;
  students: string | null;
  isCustomizeChecked: boolean;
};

const useCreate = ({
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
}: UseCreateProps) => {
  useEffect(() => {
    if (!submitClicked) {
      return;
    }

    const fetchData = async () => {
      const selectedLabPlan = labplans?.find((labplan) => labplan.id.name === selectedLP);
      const data = {
        accessToken,
        selectedLP,
        labTitle,
        login,
        password,
        students,
        isCustomizeChecked,
        author: apiData?.data.author,
        offer: apiData?.data.offer,
        publisher: apiData?.data.publisher,
        sku: apiData?.data.sku,
        version: apiData?.data.version,
        ostype: apiData?.data.osType,
        size: apiData?.data.ostype === 0 ? 'Classic_Fsv2_4_8GB_128_S_SSD' : 'Classic_Fsv2_2_4GB_128_S_SSD',
        hours: apiData?.data.ostype === 0 ? '15:00:00' : '10:00:00',
        lpName: selectedLabPlan?.id.name,
        rgName: selectedLabPlan?.id.parent.name,
        subscription: selectedLabPlan?.id.parent.parent.name,
      };

      try {
        await axios.post("https://labsauto20230330224718.azurewebsites.net/api/test6", data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error calling test4 function:", error);
      }
    };

    fetchData();
  }, [submitClicked, accessToken, apiData, labplans, selectedLP, labTitle, login, password, students, isCustomizeChecked]);
};

export default useCreate;
