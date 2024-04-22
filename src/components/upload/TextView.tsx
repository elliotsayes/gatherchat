import { useQuery } from '@tanstack/react-query'
import React from 'react'

interface Props {
  url: string;
}

const TextView = (props: Props) => {
  const { url } = props;

  const { data } = useQuery({
    queryKey: ['textView', url],
    queryFn: async () => {
      const res = await fetch(url);
      return res.text();
    }
  })

  return (
    <p>{data ?? 'loading...'}</p>
  )
}

export default TextView