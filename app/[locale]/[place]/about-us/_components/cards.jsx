import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TeamCards = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-3 lg:mt-6 gap-5 2xl:grid-cols-4">
      <Card className="*:p-0 p-3 space-y-2 md:space-y-4">
        <CardHeader className="space-y-2 md:space-y-4">
          <img
            src={`/assets/aboutCard.svg`}
            alt="news-img"
            className="w-full object-cover aspect-video rounded-md"
          />
          <div className="space-y-1">
            <CardTitle className="text-base md:text-xl tracking-wider text-blue-900">
              Шеф повар
            </CardTitle>
            <CardDescription className="text-primary max-sm:text-xs">
              Шукуров Абдугани
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-foreground md:text-base">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil
            repellendus eius nostrum id blanditiis. Qui sit incidunt
            consequuntur id deleniti officiis voluptas mollitia, sint, voluptate
            aspernatur voluptatum facilis velit libero commodi doloremque.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamCards;
