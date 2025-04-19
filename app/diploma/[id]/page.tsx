import Image from 'next/image';

interface PageProps {
  params: {
    id: string;
  };
}
import diplomaImg from '@/assets/lol.jpg';
export default function DiplomaDetailsPage({ params }: PageProps) {
  const { id } = params;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-center font-bold mb-4">Diploma Details</h1>
      <div className="flex flex-col items-center gap-4">
        <Image
          src={diplomaImg}
          alt="Diploma Image"
          width={600}
          height={400}
          className="rounded shadow"
        />
        <p className="text-lg text-center">
          This is the diploma description for ID: {id}
        </p>
        <a
          href={`/diplomas/${id}`}
          download
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          télecharger le Diplome
        </a>
      </div>
    </div>
  );
}