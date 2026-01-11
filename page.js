"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
  const router = useRouter();
  const [withdraws, setWithdraws] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("adminLogin")) {
      router.push("/admin/login");
      return;
    }

    setWithdraws(
      JSON.parse(localStorage.getItem("withdraw_requests")) || []
    );
    setUsers(
      JSON.parse(localStorage.getItem("users")) || []
    );
  }, []);

  const approveWithdraw = (id) => {
    let wd = withdraws.find(w => w.id === id);
    if (!wd) return;

    // kurangi saldo user
    const updatedUsers = users.map(u =>
      u.email === wd.email
        ? { ...u, saldo: u.saldo - wd.amount }
        : u
    );

    // update status withdraw
    const updatedWithdraws = withdraws.map(w =>
      w.id === id
        ? { ...w, status: "APPROVED" }
        : w
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "withdraw_requests",
      JSON.stringify(updatedWithdraws)
    );

    setUsers(updatedUsers);
    setWithdraws(updatedWithdraws);

    alert("Withdraw APPROVED");
  };

  const rejectWithdraw = (id) => {
    const updated = withdraws.map(w =>
      w.id === id
        ? { ...w, status: "REJECTED" }
        : w
    );

    localStorage.setItem(
      "withdraw_requests",
      JSON.stringify(updated)
    );
    setWithdraws(updated);

    alert("Withdraw REJECTED");
  };

  return (
    <div className="card">
      <h2>Admin – Approve Withdraw</h2>

      {withdraws.length === 0 && <p>Tidak ada withdraw</p>}

      {withdraws.map(w => (
        <div key={w.id} className="card">
          <p><b>User:</b> {w.email}</p>
          <p><b>Jumlah:</b> Rp {w.amount.toLocaleString()}</p>
          <p><b>Status:</b> {w.status}</p>

          {w.status === "PENDING" && (
            <>
              <button
                className="btn"
                onClick={() => approveWithdraw(w.id)}
              >
                Approve
              </button>

              <br /><br />

              <button
                className="btn"
                onClick={() => rejectWithdraw(w.id)}
              >
                Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}