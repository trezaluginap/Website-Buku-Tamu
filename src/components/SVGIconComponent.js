// // --- Definisi Komponen Ikon SVG ---
// const IconMenu = ({ className = "w-6 h-6", isOpen = false }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     {isOpen ? (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M6 18L18 6M6 6l12 12"
//       />
//     ) : (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
//       />
//     )}
//   </svg>
// );

// const IconRefresh = ({ className = "w-5 h-5" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
//     />
//   </svg>
// );

// const IconSearch = ({ className = "w-5 h-5" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
//     />
//   </svg>
// );

// const IconCalendarDays = ({ className = "w-6 h-6" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
//     />
//   </svg>
// );

// const IconChartBar = ({ className = "w-6 h-6" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
//     />
//   </svg>
// );

// const IconClock = ({ className = "w-6 h-6" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//     />
//   </svg>
// );

// const IconCheckCircle = ({ className = "w-6 h-6" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//     />
//   </svg>
// );

// const IconEye = ({ className = "w-5 h-5" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
//     />
//   </svg>
// );

// const IconPlay = ({ className = "w-5 h-5" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
//     />
//   </svg>
// );

// const IconCheck = ({ className = "w-5 h-5" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="m4.5 12.75 6 6 9-13.5"
//     />
//   </svg>
// );

// const IconChevronDown = ({ className = "w-4 h-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={2.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="m19.5 8.25-7.5 7.5-7.5-7.5"
//     />
//   </svg>
// );

// const IconListBullet = ({ className = "w-6 h-6" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     strokeWidth={1.5}
//     stroke="currentColor"
//     className={className}
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
//     />
//   </svg>
// //);
// // --- Akhir Definisi Komponen Ikon SVG ---
