"use client";
import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState({
    name: null,
    age: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const resp = await fetch("/api/home");
        if (resp.ok) {
          const res = await resp.json(); // Await the JSON response
          setData({
            name: res.name,
            age: res.age,
          });
        } else {
          console.error("Failed to fetch data. Response not OK.");
        }
      } catch (e) {
        console.error("Failed to fetch data:", e);
      } finally {
        setLoading(false); // Stop the loading spinner once the fetch is complete
      }
    }

    getData();
  }, []);

  return (
    <>
      {loading ? (
        <p>Trying to get data...</p>
      ) : data.name ? (
        <p>
          Name: {data.name}, Age: {data.age}
        </p>
      ) : (
        <p>No data available</p>
      )}
    </>
  );
}
