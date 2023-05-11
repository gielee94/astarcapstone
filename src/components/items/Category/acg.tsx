import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/types";
import axios from "axios";
import './Category.css';

interface SharedGallery {
  resourceGroupName: string;
  sharedGalleryId: string;
  sharedGallerySubscription: string;
}

interface GalleryDetails {
  galleryname: string;
  resourceGroupName: string;
  sharedGallerySubscription: string;
}

const ACG: React.FC = () => {
  const sharedGalleries = useSelector((state: AppState) => state.labPlans.sharedGalleries);
  const accessToken = useSelector((state: AppState) => state.token.accessToken);
  const [loading, setLoading] = useState(true);

  const [apiData, setApiData] = useState<any[]>([]);

  useEffect(() => {
    const fetchApiData = async () => {
      const galleryDetailsArray: GalleryDetails[] = (sharedGalleries || []).map(
        (gallery: SharedGallery) => {
          return {
            galleryname: gallery.sharedGalleryId,
            resourceGroupName: gallery.resourceGroupName,
            sharedGallerySubscription: gallery.sharedGallerySubscription,
          };
        }
      );

      for (const galleryDetail of galleryDetailsArray) {
        try {
          const response = await axios.get(
            "https://labsauto20230330224718.azurewebsites.net/api/acg_img",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              params: galleryDetail,
            }
          );
          setApiData((prevData) => [...prevData, ...response.data]);
        } catch (error) {
          console.error("Error fetching gallery image data:", error);
        }
      }
    };
    fetchApiData();
    setLoading(false);
  }, [sharedGalleries, accessToken]);

  return (
    <div className="category-container">
      {loading ? (
        null
      ) : (
        <>
          {apiData.length > 0 && <h2 className="category-title">ACG Gallery</h2>}
          <div className="box-container">
            {apiData.map((data, index) => {
              // Extract relevant parts
              const imageName = data.id?.name ?? "";
              const acgName = data.id?.parent?.name ?? "";
              const rgName = data.id?.parent?.parent?.name ?? "";
              const subscription = data.id?.parent?.parent?.parent?.name ?? "";
              const sharedGalleryId = `/subscriptions/${subscription}/resourceGroups/${rgName}/providers/Microsoft.Compute/galleries/${acgName}/images/${imageName}`;

              return (
                <div key={index} className="box">
                  <h2>{imageName}</h2>
                  <h2>OS Type: {data.osType === 0 ? "Windows" : "Linux"}</h2>
                  <p>ACG Name: {acgName}</p>
                  <p>RG Name: {rgName}</p>
                  <p>Sub: {subscription}</p>
                  <p className="hide">SharedGalleryId: {sharedGalleryId}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ACG;