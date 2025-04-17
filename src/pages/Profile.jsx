import React from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileImage from '../components/profile/ProfileImage';
import ProfileInfoItem from '../components/profile/ProfileInfoItem';
import { UserRound, AtSign, Signature, Dna } from 'lucide-react'; // Import required icons

const Profile = () => {
  return (
    <div className="container py-4" style={{ backgroundColor: '#121B22', minHeight: '100vh' }}>
      <ProfileHeader />
      <ProfileImage />
   
      {/* Name with UserRound Icon */}
      <ProfileInfoItem
        icon={<UserRound size={26} className="text-white me-2" style={{ verticalAlign: 'middle' }} />}
        label="Name"
        value="Keenshaheer"
      />
      
      {/* About with Dna Icon */}
      <ProfileInfoItem
        icon={<Dna size={26} className="text-white me-2" style={{ verticalAlign: 'middle' }} />}
        label="About"
        value="Hey there! I am using WhatsApp."
      />
      
      {/* Email with AtSign Icon */}
      <ProfileInfoItem
        icon={<AtSign size={26} className="text-white me-2" style={{ verticalAlign: 'middle' }} />}
        label="Email"
        value="keenshaheer@example.com"
      />
      
      {/* Username with Icon */}
      <ProfileInfoItem
        icon={<Signature size={26} className="text-white me-2" style={{ verticalAlign: 'middle' }} />}
        label="Username"
        value="Keenshaheer"
      />
    
    </div>
  );
};

export default Profile;
