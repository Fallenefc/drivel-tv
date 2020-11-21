import BroadcastInterface from "../interfaces/Broadcast";

// Function to get all broadcasts from backend server
export async function apiGetAllBroadcasts (): Promise<BroadcastInterface[] | boolean> {
  // Call backend API
  try {
    const response: Response = await fetch('/api/get-all-broadcasts');
    if (response) { // If response is ok (200 range)
      const allBroadcastObjects: BroadcastInterface[] = await response.json(); // Parse JSON response
      return allBroadcastObjects
      // setAllBroadcastObjects(allBroadcastObjects); // Set array of broadcast objects as state
    } else { return false;}; // Else if no broadcasts, send user to 404
  } catch (err) {
    console.log(err);
    return false;
  }
 };


  // Function to get broadcast from backend server
  export async function apiGetBroadcast (id:string): Promise<BroadcastInterface | boolean> {
    // Call backend API
    try {
      const response: Response = await fetch('/api/get-broadcast', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"broadcastId": id}) // Stringify to JSON before posting
      });
      if (response) { // If response is ok (200 range)
        const broadcastObj: BroadcastInterface = await response.json(); // Parse JSON response
        return broadcastObj;
        // setBroadcast(broadcastObj); // Set broadcast object as state
      } else { return false;}; // Else if broadcast does not exist in DB, send user to 404
    } catch (err) {
      console.log(err);
      return false;
    }
  };