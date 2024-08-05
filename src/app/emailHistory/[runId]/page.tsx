interface PageProps {
  params: {
    runId: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div>
      <p>RunId : {params.runId} </p>
    </div>
  );
}
