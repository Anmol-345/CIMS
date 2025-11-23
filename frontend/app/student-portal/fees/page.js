"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

import { useAuth } from "@/utils/auth";

export default function FeesPage() {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [feesToPay, setFeesToPay] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("UPI");

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses");
      const data = await res.json();
      setAllCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Map user courses with info
  const userCourses =
    user?.courses?.map((uc) => {
      const courseInfo = allCourses.find((ac) => ac._id === uc.course);
      return {
        ...uc,
        name: courseInfo?.name || "Unknown Course",
        code: courseInfo?.code || "N/A",
        fee: courseInfo?.fee ?? 0,
      };
    }) || [];

  const totalUnpaid = userCourses.reduce(
    (sum, course) => (!course.feePaid ? sum + course.fee : sum),
    0
  );

  // Checkbox toggle
  const toggleCourseSelection = (courseId, feePaid) => {
    if (feePaid) return;
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  useEffect(() => {
    const total = selectedCourses.reduce((sum, id) => {
      const course = userCourses.find((c) => c.course === id);
      return sum + (course?.fee || 0);
    }, 0);
    setFeesToPay(total);
  }, [selectedCourses]);

  // Handle payment
  const handlePay = async () => {
    setLoading(true);
    setAlertMsg("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      for (let courseId of selectedCourses) {
        await fetch(`http://localhost:5000/api/students/fees`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, feePaid: true }),
          credentials: "include",
        });
      }

      window.location.reload();
    } catch (err) {
      setAlertMsg("Failed to pay fees. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">

        <h2 className="text-2xl sm:text-3xl font-semibold text-center">
          Pay Your Fees
        </h2>

        {/* Total Unpaid */}
        <div className="p-4 border rounded-lg bg-muted flex justify-between items-center">
          <span className="text-lg font-semibold">Total Unpaid Fees:</span>
          <span className="text-lg font-bold text-red-600">₹{totalUnpaid}</span>
        </div>

        {/* Selected Fees */}
        <div className="p-4 border rounded-lg bg-muted flex justify-between items-center">
          <span className="text-lg font-semibold">Fees to Pay:</span>
          <span className="text-lg font-bold text-primary">₹{feesToPay}</span>
        </div>

        {alertMsg && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{alertMsg}</AlertDescription>
          </Alert>
        )}

        {/* Courses List */}
        <div className="border rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
          {userCourses.length === 0 ? (
            <p className="text-center">No courses enrolled</p>
          ) : (
            userCourses.map((course) => (
              <div
                key={course.course}
                className="flex flex-col sm:flex-row justify-between items-center py-2 border-b last:border-b-0 gap-2 sm:gap-0"
              >
                <div className="flex items-center gap-2 w-full sm:w-[70%]">
                  <Checkbox
                    checked={selectedCourses.includes(course.course)}
                    onCheckedChange={() =>
                      toggleCourseSelection(course.course, course.feePaid)
                    }
                    disabled={course.feePaid}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium truncate">{course.name}</span>
                    <span className="text-xs text-muted-foreground">{course.code}</span>
                  </div>
                </div>
                <span className="font-semibold">
                  {course.feePaid ? "Paid" : `₹${course.fee}`}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pay Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedCourses.length === 0} className="w-full">
              Pay Selected Fees
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[420px] w-full">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Razorpay Payment
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Branding */}
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                  ₹
                </div>
                <div>
                  <p className="font-medium text-base">Secure Payment</p>
                  <p className="text-sm text-muted-foreground">
                    Complete your transaction safely
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="p-4 border rounded-lg bg-muted flex justify-between items-center">
                <span className="text-lg font-medium">Amount to Pay:</span>
                <span className="text-xl font-bold text-primary">₹{feesToPay}</span>
              </div>

              {/* Payment Methods */}
              <div className="border rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Select Payment Method
                </p>

                {["UPI", "Card", "NetBanking"].map((method) => (
                  <div
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer transition 
                      ${selectedMethod === method ? "bg-primary text-primary-foreground" : "hover:bg-secondary w-full"}
                    `}
                  >
                    <span className="font-medium">{method}</span>
                    <span className="text-xs text-muted-foreground">
                      {method === "UPI" && "GPay / PhonePe / Paytm"}
                      {method === "Card" && "Visa / Mastercard / Rupay"}
                      {method === "NetBanking" && "All major banks"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-20">
                <Spinner />
              </div>
            ) : (
              <DialogFooter>
                <Button onClick={handlePay} className="w-full text-base font-semibold">
                  Pay ₹{feesToPay}
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
