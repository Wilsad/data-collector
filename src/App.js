import { saveEntryLocally } from './db';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = {
    firstName: "John", // usually from state
    lastName: "Doe",
    phone: "0208843256",
    location: "Bortianor",
    invitedBy: "Evelyn",
    invitedPhone: "0248843764"
  };

  try {
    await saveEntryLocally(formData);
    alert("Saved locally! It will sync when you're online.");
    // Trigger a sync attempt here (we'll do this in step 3)
  } catch (error) {
    console.error("Failed to save locally", error);
  }
};