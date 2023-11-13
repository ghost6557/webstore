'use client';

import styles from './PageLayout.module.scss';
import useFetchData from '@/hooks/useFetchData';
import PhoneCard from '@/components/PhoneCard';
import PhonesWrapper from '@/components/PhonesWrapper';
import { useSelector } from 'react-redux';
// import { getShowModal } from '@/store/slices/cartSlice';

import {
  LoginButton,
  LogoutButton,
  ProfileButton,
  RegisterButton,
} from '@/components/buttons';
// import { User } from '@/components/user';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';

export default function Page() {
  // const session = getServerSession(authOptions);
  // console.log(session);

  return (
    <main
      style={{
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
      }}
    >
      <div>
        <LoginButton />
        <RegisterButton />
        <LogoutButton />
        <ProfileButton />
        {/* <button onClick={main}>NEW USER</button> */}
        {/* <h1>Server Session</h1> */}
        {/* <pre>{JSON.stringify('session')}</pre> */}
        {/* <User /> */}
      </div>
    </main>
  );
}

//   const data: any = useFetchData('');

//   return (
//     <div className={styles.page}>
//       {/* <h1>Hello, Next.js!</h1> */}
//       {!data && <h2>Loading...</h2>}
//       {/* {data && (
//         <PhonesWrapper>
//           {data.map((phone: any) => (
//             <PhoneCard
//               key={phone['m_id']}
//               imgUrl={phone['img_url']}
//               model={phone['model_name']}
//               modelId={phone['m_id']}
//             />
//           ))}
//         </PhonesWrapper>
//       )} */}

//       {/* {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}

//       <main
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '70vh',
//         }}
//       >
//         <div>
//           <LoginButton />
//           <RegisterButton />
//           <LogoutButton />
//           <ProfileButton />
//         </div>
//       </main>
//     </div>
//   );
// }
