import React from "react";
import { useRouter } from "next/router";
const Redeem = () => {
  const router = useRouter();
  const _tokenAddress = router.query.id;
  return <div>{_tokenAddress}</div>;
};

export default Redeem;
