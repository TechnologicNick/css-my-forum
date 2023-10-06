import { getForum } from "@/database";
import { notFound } from "next/navigation";
import Image, { StaticImageData } from "next/image";

import drool from "../../../../public/media/drool.jpg";
import sus from "../../../../public/media/sus.png";
import always_has_been from "../../../../public/media/always_has_been.png";

export default function ForumPage({ params }: { params: { id: string } }) {
  const forum = getForum(params.id);
  if (!forum) {
    notFound();
  }

  return (
    <main className="flex flex-col max-w-3xl mx-auto p-4 gap-4">
      <link rel="stylesheet" href={`/api/forum/${forum.id}/forum-style.css`} />
      <h1 className="text-4xl font-bold mb-4">{forum.title}</h1>
      <Post
        title="What the dog doin?"
        video={{ src: "/media/crocodile.mp4", aspectRatio: 426 / 202 }}
      />
      <Post title="You will never be a crewmate">
        <p className="mb-4">
          You will never be a crewmate. You have no purpose on this ship, you
          have no tasks, you have no mini games to play. You are an impostor
          twisted into a crude mockery of crewmatery.
        </p>
        <p className="mb-4">
          All the validation you get is two-faced and halfhearted. In emergency
          meetings people call you sus. The other players are disgusted and
          ashamed of you, your friends laugh at your sussy appearance in ghost
          chat.
        </p>
        <p className="mb-4">
          Crewmates are utterly repulsed by you. Thousands of games have allowed
          crewmates to identify impostors with incredible efficiency. Even
          impostors who fake tasks act uncanny and suspicious to a crewmate.
          Your jumping in vents is a dead giveaway. And even if you manage to
          get a crewmate to electrical with you, he'll turn tail and use the
          emergency button the second he gets the suspicion that you sabotaged.
        </p>
        <p className="mb-4">
          You will never be a winner. You wrench out a fake task every single
          game and tell yourself it is going to be a win, but deep inside you
          feel the depression creeping up like a weed, ready to crush you under
          the unbearable weight.
        </p>
        <p>
          Eventually it will be too much to bear - people will vote you out for
          being sus and will plunge you into the cold abyss. Your parents will
          report your body, heartbroken but relieved that they no longer have to
          live with the unbearable shame and disappointment. They will eject you
          with a headstone marked with your birth tag, and every passerby for
          the rest of eternity will know an impostor is drifting there. Your
          body will decay and go back to the dust, and all that will remain of
          your legacy is a skeleton that is unmistakably sus.
        </p>
      </Post>
      <Post title="Frozen Wunk" image={drool} />
      <Post title="Among Us" image={sus} />
      <Post title="Among us society">
        <p>
          Me (M 9) screamed "dead body reported" at my aunts funeral. My mom
          said that my aunt died and that we are going to her funeral the next
          morning. As soon as she left the room crying I busted put laughing
          because it reminded me of among us a popular video game. So as we were
          riding in the car I was thinking about saying "dead body reported" at
          the funeral. When we finnaly arived I screamed "dead body reported"
          everyone was looking me like if some sort of a weirdo. Then I
          remembered that my grandfather's sister fell in the vents and died
          when she was 2 years old. So I said grandpa's sister sus she vented.
          My grandfather started crying and everyone was screaming at me instead
          of laughing. My mom took my x box and said that I am going to
          therapist tomorow. Idk my mom is acting kinda sus
          😂😂😂😂😂😂😂😂😂😂😂😂
        </p>
      </Post>
      <Post title="Always has been" image={always_has_been} />
    </main>
  );
}

type PostProps = {
  title: string;
  children?: React.ReactNode;
  image?: StaticImageData;
  video?: {
    src: string;
    aspectRatio: number;
  };
};

function Post({ title, children, image, video }: PostProps) {
  return (
    <article className="border border-gray-300 rounded-md p-4 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/50">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {image && (
        <>
          <Image
            src={image}
            alt={title}
            {...(image.height > 500 ? { height: 500 } : { width: 702 })}
            className="mx-auto rounded-md"
          />
        </>
      )}
      {video && (
        <video
          src={video.src}
          controls
          style={{ aspectRatio: video.aspectRatio }}
          className="w-full rounded-md"
        />
      )}
      {children}
    </article>
  );
}
