import { useEffect, useState } from "react";

export const TodoDateTime = () => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = now.toLocaleDateString("en-US", options);
      const formattedTime = now.toLocaleTimeString();

      setDateTime(`${formattedDate} - ${formattedTime}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return <h4 className="text-center">{dateTime}</h4>;
};
