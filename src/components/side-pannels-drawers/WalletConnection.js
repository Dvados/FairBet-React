// import React from 'react';
// import { IoCloseSharp } from "react-icons/io5";
// import { useWallet } from '../../wallet/UseWallet.js';

// export default function WalletConnectionDrawer({ children}) {
//     const { wallet } = useWallet();

//     return (
//         <main
//             className={
//                 " fixed overflow-hidden z-10 inset-0 transform ease-in-out " +
//                 (wallet
//                     ? " transition-opacity opacity-100 duration-500 translate-x-0  "
//                     : " transition-all delay-200 opacity-0 translate-x-full  ")
//             }
//         >
//             <section
//                 className={
//                     "w-1/4 m-3 rounded-xl max-w-lg right-0 absolute bg-gray-900 h-5/6 shadow-xl delay-400 duration-300 ease-in-out transition-all transform  " +
//                     (wallet ? " translate-x-0 " : " translate-x-full ")
//                 }
//             >
//                 <article className="relative w-full max-w-lg pb-10 flex flex-col">
//                     <div className="flex flex-row items-center">
//                         <button className="p-2 m-4 rounded-lg bg-gray-800 hover:bg-gray-800 cursor-pointer hover:bg-indigo-900" ><IoCloseSharp className="text-white text-3xl" /></button>
//                         <header className='p-4 font-bold text-white text-lg'>Connect a Wallet</header>
//                     </div>
//                     {children}
//                 </article>
//             </section>
//             <section
//                 className="w-screen h-full cursor-pointer "
//             ></section>
//         </main>
//     );
// }



import React from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { useWallet } from '../../wallet/UseWallet.js';

export default function WalletConnectionDrawer({ children, isWalletSidePannel, setIsWalletSidePannel }) {
    // const { wallet } = useWallet();

    return (
        <main
            className={
                " fixed overflow-hidden z-10 inset-0 transform ease-in-out " +
                (isWalletSidePannel
                    ? " transition-opacity opacity-100 duration-500 translate-x-0  "
                    : " transition-all delay-200 opacity-0 translate-x-full  ")
            }
        >
            <section
                className={
                    "w-1/4 m-3 rounded-xl max-w-lg right-0 absolute bg-gray-900 h-5/6 shadow-xl delay-400 duration-300 ease-in-out transition-all transform  " +
                    (isWalletSidePannel ? " translate-x-0 " : " translate-x-full ")
                }
            >
                <article className="relative w-full max-w-lg pb-10 flex flex-col">
                    <div className="flex flex-row items-center">
                        <button className="p-2 m-4 rounded-lg bg-gray-800 hover:bg-gray-800 cursor-pointer hover:bg-indigo-900" ><IoCloseSharp className="text-white text-3xl" onClick={() => setIsWalletSidePannel(false)} /></button>
                        <header className='p-4 font-bold text-white text-lg'>Connect a Wallet</header>
                    </div>
                    {children}
                </article>
            </section>
            <section
                className="w-screen h-full cursor-pointer "
            ></section>
        </main>
    );
}
// import React from 'react';
// import { IoCloseSharp } from "react-icons/io5";
// import { useWallet } from '../../wallet/UseWallet.js';

// export default function WalletConnectionDrawer({ children}) {
//     const { wallet } = useWallet();

//     return (
//         <main
//             className={
//                 " fixed overflow-hidden z-10 inset-0 transform ease-in-out " +
//                 (wallet
//                     ? " transition-opacity opacity-100 duration-500 translate-x-0  "
//                     : " transition-all delay-200 opacity-0 translate-x-full  ")
//             }
//         >
//             <section
//                 className={
//                     "w-1/4 m-3 rounded-xl max-w-lg right-0 absolute bg-gray-900 h-5/6 shadow-xl delay-400 duration-300 ease-in-out transition-all transform  " +
//                     (wallet ? " translate-x-0 " : " translate-x-full ")
//                 }
//             >
//                 <article className="relative w-full max-w-lg pb-10 flex flex-col">
//                     <div className="flex flex-row items-center">
//                         <button className="p-2 m-4 rounded-lg bg-gray-800 hover:bg-gray-800 cursor-pointer hover:bg-indigo-900" ><IoCloseSharp className="text-white text-3xl" /></button>
//                         <header className='p-4 font-bold text-white text-lg'>Connect a Wallet</header>
//                     </div>
//                     {children}
//                 </article>
//             </section>
//             <section
//                 className="w-screen h-full cursor-pointer "
//             ></section>
//         </main>
//     );
// }