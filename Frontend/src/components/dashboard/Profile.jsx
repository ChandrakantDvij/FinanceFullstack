
// import { motion } from "framer-motion";
// import { useAuth } from "@/contexts/AuthContext";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// export default function Profile() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   if (!user) {
//     return (
//       <div className="p-6 text-center">
//         <p className="text-muted-foreground">No user data found. Please login again.</p>
//         <Button onClick={() => navigate("/login")} className="mt-3">
//           Go to Login
//         </Button>
//       </div>
//     );
//   }

//   const initials = user.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
//       {/* Background animated circles */}
//       <motion.div
//         className="absolute w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"
//         animate={{
//           x: [0, 100, -100, 0],
//           y: [0, 50, -50, 0],
//         }}
//         transition={{
//           duration: 12,
//           repeat: Infinity,
//           repeatType: "reverse",
//         }}
//       />
//       <motion.div
//         className="absolute w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20"
//         animate={{
//           x: [100, -100, 100],
//           y: [50, -50, 50],
//         }}
//         transition={{
//           duration: 15,
//           repeat: Infinity,
//           repeatType: "reverse",
//         }}
//       />

//       {/* Profile Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <Card className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/30">
//           <CardContent className="p-8 text-center">
//             <motion.div
//               className="flex flex-col items-center space-y-4"
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.6 }}
//             >
//               <Avatar className="w-24 h-24 border-4 border-white shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500">
//                 <AvatarFallback className="text-white text-2xl font-bold">
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>

//               <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
//               <p className="text-sm text-gray-500 capitalize">{user.role}</p>
//             </motion.div>

//             <div className="mt-6 space-y-3 text-left text-gray-700">
//               <p>
//                 <strong>Email:</strong> {user.email}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {user.phone}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';


export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No user data found. Please login again.</p>
        <Button onClick={() => navigate("/login")} className="mt-3">
          Go to Login
        </Button>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex w-full min-h-screen bg-background">
      <Sidebar role={user?.role || 'accountant'} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 relative flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl overflow-hidden border border-white/20 bg-gray-900 text-white">
          {/* Animated wave background inside the card */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPositionX: ["0%", "100%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.4) 0%, transparent 70%), radial-gradient(circle at 80% 50%, rgba(168,85,247,0.4) 0%, transparent 70%)",
              backgroundSize: "200% 200%",
            }}
          />

          <CardContent className="relative p-8 text-center">
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Avatar className="w-24 h-24 border-4 border-gray-700 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <AvatarFallback className="text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-300 capitalize">{user.role}</p>
            </motion.div>

            <div className="mt-6 space-y-3 text-left text-gray-200">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
        </main>
      </div>
    </div>
  );
}
