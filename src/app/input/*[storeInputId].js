"use client";

import { CustomTable } from "@/components/customTable";
import { useEffect, useState } from "react";

export default function InputDetail() {
  const [pagination, setPagination] = useState({
    page: 1,
    recordSize: 20,
  });
  const [inputItem, setinputItem] = useState([]);

  const handleinputItem = async () => {
    const inputItemReqUrl = new URL("http://localhost:8080/api/store/stock/input");
    inputItemReqUrl.pathname = "39";

    console.log(pagination["page"]);
    console.log(pagination["recordSize"]);

    setPagination({ ...pagination, page: pagination["page"] + 1 });

    console.log(pagination["page"]);

    await fetch(inputItemReqUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setinputItem(res["data"]);
        setPagination(res["pagination"]);
      });
  };
  useEffect(() => {
    handleinputItem();
    handlePagiantion();
  }, []);

  const handlePagiantion = () => {
    setPagination({ ...pagination, page: pagination["page"] + 1 });
  };

  return (
    <div className="p-6 py-16 sm:ml-48 bg-gray-100 h-screen">
      <CustomTable
        data={inputItem}
        pagination={pagination}
        header={[
          { label: "items", col_name: "items" },
          { label: "입고일", col_name: "inputAt" },
          { label: "검수", col_name: "state" },
        ]}
      />
    </div>
  );
}
