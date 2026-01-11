"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("isLogin")) {
      router.push("/login");
      return;
    }

    const email = localStorage.getItem("userLogin");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email);

    if (user) setSaldo(user.saldo);
  }, []);

  const klaimMisi = (reward) => {
    const email = localStorage.getItem("userLogin");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updated = users.map(u =>
      u.email === email ? { ...u, saldo: u.saldo + reward } : u
    );

    localStorage.setItem("users", JSON.stringify(updated));
    setSaldo(saldo + reward);
  };

  return (
    <div className="card">
      <h2>Saldo</h2>
      <p>Rp {saldo.toLocaleString()}</p>
      <button className="btn" onClick={() => klaimMisi(5000)}>
        Klaim Misi
      </button>
    </div>
  );
}