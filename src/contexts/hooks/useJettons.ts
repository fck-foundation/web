import { JType } from "contexts/AppContext";
import { useEffect, useState } from "react";

export function useJettons() {
  const [value, set] = useState<JType[]>([]);

  // const { isLoading: isJLoading, refetch } = useQuery({
  //   queryKey: ["jettons"],
  //   queryFn: ({ signal }) => fck.getJettons(signal),
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   onSuccess: (response) => {
  //     const today = new Date();
  //     today.setHours(today.getHours() - 24);

  //     const listVerified = response
  //       .filter(
  //         ({ verified, address }) =>
  //           verified && !list.includes(address) && !hideList.includes(address)
  //       )
  //       .map(({ address }) => address);
  //     if (listVerified.length) {
  //       setList((prevState) => [...new Set([...listVerified, ...prevState])]);
  //     }

  //     setJettons(response);
  //   },
  // });

  return {
    value,
    set,
  };
}
