import axios from 'axios';
import BASE_URL from '../config/urlConfig';

const getAuthHeaders = () =>{
const token = localStorage.getItem ('token')||localStorage.getItem ('userToken');
return{
    'Content-Type' :'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
};
}

//post investor api
const assignInvestorApi = {
    createAssignInvestor: async(data)=>{
        try{
            const response =  await axios.post (`${BASE_URL}/api/assign-investors`,data ,{
                headers:getAuthHeaders(),
            });
        return response.data;
        } catch (error){
            if (error.response?.status === 401){
                localStorage.clear();  
                throw new Error('Please login to continue');
            }
        }
        throw new Error(error.response?.data?.message || error.message || 'Failed to assign employee to project');
    },
   // get investor api
   getAssignInvestorById : async(id)=>{
    try{
        const response = await axios.get (`${BASE_URL}/api/assign-investors/${id}`,{ 
            headers: getAuthHeaders(),
            } );
            const payload = response.data;    
            if (Array.isArray(payload)) return payload;
            if (payload && Array.isArray(payload.data)) return payload.data;
            if (payload && typeof payload === 'object') {
              // If single object, wrap in array
              return [payload];
            }    
            return [];
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.clear();
            throw new Error('Please login to continue');
          }
          if (error.response?.status === 404) {
            // No assignments found for this project
            return [];
          }
          console.error("Error fetching assign by project ID:", error);
          throw new Error(error.response?.data?.message || error.message || "Failed to fetch project assignments by project ID");
        }
    }
   }
 export default assignInvestorApi;



