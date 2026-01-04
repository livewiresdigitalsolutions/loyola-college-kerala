// // import { LucideIcon } from "lucide-react";

// // interface StatsCardProps {
// //   title: string;
// //   value: string | number;
// //   icon: LucideIcon;
// //   change?: string;
// //   changeType?: "increase" | "decrease";
// //   color?: string;
// // }

// // export default function StatsCard({
// //   title,
// //   value,
// //   icon: Icon,
// //   change,
// //   changeType,
// //   color = "bg-blue-500",
// // }: StatsCardProps) {
// //   return (
// //     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
// //       <div className="flex items-center justify-between">
// //         <div className="flex-1">
// //           <p className="text-sm font-medium text-gray-600">{title}</p>
// //           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
// //           {change && (
// //             <p
// //               className={`text-sm mt-2 ${
// //                 changeType === "increase" ? "text-green-600" : "text-red-600"
// //               }`}
// //             >
// //               {change}
// //             </p>
// //           )}
// //         </div>
// //         <div className={`${color} w-14 h-14 rounded-full flex items-center justify-center`}>
// //           <Icon className="w-7 h-7 text-white" />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }







// // app/sys-ops/components/StatsCard.tsx
// import { LucideIcon } from "lucide-react";

// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   change?: string;
//   changeType?: "increase" | "decrease";
//   color?: string;
// }

// export default function StatsCard({
//   title,
//   value,
//   icon: Icon,
//   change,
//   changeType,
//   color = "bg-blue-500",
// }: StatsCardProps) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
//       <div className="flex items-center justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//           {change && (
//             <p
//               className={`text-sm mt-2 ${
//                 changeType === "increase" ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {change}
//             </p>
//           )}
//         </div>
//         <div className={`${color} w-14 h-14 rounded-full flex items-center justify-center`}>
//           <Icon className="w-7 h-7 text-white" />
//         </div>
//       </div>
//     </div>
//   );
// }







// app/sys-ops/components/StatsCard.tsx
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease";
  color?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  color = "bg-blue-500",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      
      {change && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          {changeType === "increase" ? (
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : changeType === "decrease" ? (
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          ) : null}
          <p className={`text-sm font-medium ${
            changeType === "increase" ? "text-green-600" : 
            changeType === "decrease" ? "text-red-600" : 
            "text-gray-600"
          }`}>
            {change}
          </p>
        </div>
      )}
    </div>
  );
}
