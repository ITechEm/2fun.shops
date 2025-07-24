'use client';
import AddressInputs from "@/components/layout/AddressInputs";
import EditableImage from "@/components/layout/EditableImage";
import { useProfile } from "@/components/UseProfile";
import { useState, useEffect } from "react";

export default function UserForm({ user, onSave }) {
  if (!user) {
    return <p>Loading user data...</p>;
  }

  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [admin, setAdmin] = useState(user?.admin || false);

  useEffect(() => {
    setUserName(user?.name || '');
    setImage(user?.image || '');
    setPhone(user?.phone || '');
    setStreetAddress(user?.streetAddress || '');
    setPostalCode(user?.postalCode || '');
    setCity(user?.city || '');
    setCountry(user?.country || '');
    setAdmin(user?.admin || false);
  }, [user]);

  const { data: loggedInUserData } = useProfile();

  console.log('UserForm render', { user, loggedInUserData });

  function handleAddressChange(propName, value) {
    switch (propName) {
      case 'phone': setPhone(value); break;
      case 'streetAddress': setStreetAddress(value); break;
      case 'postalCode': setPostalCode(value); break;
      case 'city': setCity(value); break;
      case 'country': setCountry(value); break;
      default: break;
    }
  }

  return (
    <div className="md:flex gap-4">
      <div>
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage link={image || ''} setLink={setImage} />
        </div>
      </div>
      <form
        className="grow"
        onSubmit={ev => {
          ev.preventDefault();
          onSave(ev, {
            name: userName,
            image,
            phone,
            admin,
            streetAddress,
            city,
            country,
            postalCode,
          });
        }}
      >
        <label>First and last name</label>
        <input
          type="text"
          placeholder="First and last name"
          value={userName}
          onChange={ev => setUserName(ev.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          disabled
          value={user.email || ''}
          placeholder="email"
        />

        <AddressInputs
          addressProps={{ phone, streetAddress, postalCode, city, country }}
          setAddressProp={handleAddressChange}
        />

        {loggedInUserData?.admin && (
          <div>
            <label
              className="p-2 inline-flex items-center gap-2 mb-2"
              htmlFor="adminCb"
            >
              <input
                id="adminCb"
                type="checkbox"
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span>Admin</span>
            </label>
          </div>
        )}

        <button className="saveButton" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}


// 'use client';
// import AddressInputs from "@/components/layout/AddressInputs";
// import EditableImage from "@/components/layout/EditableImage";
// import {useProfile} from "@/components/UseProfile";
// import {useState} from "react";

// export default function UserForm({user,onSave}) {
//   const [userName, setUserName] = useState(user?.name || '');
//   const [image, setImage] = useState(user?.image || '');
//   const [phone, setPhone] = useState(user?.phone || '');
//   const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
//   const [postalCode, setPostalCode] = useState(user?.postalCode || '');
//   const [city, setCity] = useState(user?.city || '');
//   const [country, setCountry] = useState(user?.country || '');
//   const [admin, setAdmin] = useState(user?.admin || false);
//   const {data:loggedInUserData} = useProfile();

//   function handleAddressChange(propName, value) {
//     if (propName === 'phone') setPhone(value);
//     if (propName === 'streetAddress') setStreetAddress(value);
//     if (propName === 'postalCode') setPostalCode(value);
//     if (propName === 'city') setCity(value);
//     if (propName === 'country') setCountry(value);
//   }

//   return (
//     <div className="md:flex gap-4">
//       <div>
//         <div className="p-2 rounded-lg relative max-w-[120px]">
//           <EditableImage link={image} setLink={setImage} />
//         </div>
//       </div>
//       <form
//         className="grow"
//         onSubmit={ev =>
//           onSave(ev, {
//             name:userName, image, phone, admin,
//             streetAddress, city, country, postalCode,
//           })
//         }
//       >
//         <label>
//           First and last name
//         </label>
//         <input
//           type="text" placeholder="First and last name"
//           value={userName} onChange={ev => setUserName(ev.target.value)}
//         />
//         <label>Email</label>
//         <input
//           type="email"
//           disabled={true}
//           value={user.email}
//           placeholder={'email'}
//         />
//         <AddressInputs
//           addressProps={{phone, streetAddress, postalCode, city, country}}
//           setAddressProp={handleAddressChange}
//         />
//         {loggedInUserData.admin && (
//           <div>
//             <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
//               <input
//                 id="adminCb" type="checkbox" className="" value={'1'}
//                 checked={admin}
//                 onChange={ev => setAdmin(ev.target.checked)}
//               />
//               <span>Admin</span>
//             </label>
//           </div>
//         )}
//         <button className="saveButton" type="submit">Save</button>
//       </form>
//     </div>
//   );
// }