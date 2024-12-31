import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { news } from "@/public";
import { Eye } from "lucide-react";

const PromotionCards = () => {
  return (
    <main>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-3 lg:mt-6 gap-5 2xl:grid-cols-4">
        <Card>
          <CardHeader className="p-0">
            <img
              src={`${news.src}`}
              alt="news-img"
              className="w-full object-cover aspect-video"
            />
            <div className="p-6">
              <CardDescription className="text-primary max-sm:text-xs">
                Новости
              </CardDescription>
              <CardTitle className="text-base md:text-2xl tracking-wider">
                Новость 1
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil
              repellendus eius nostrum id blanditiis. Qui sit incidunt
              consequuntur id deleniti officiis voluptas mollitia, sint,
              voluptate aspernatur voluptatum facilis velit libero commodi
              doloremque.
            </p>
          </CardContent>
          <CardFooter className="text-xs flex items-center justify-between">
            <p>03.12.2024</p>
            <span className="flex items-center">
              <Eye className="size-4 inline mr-1 align-middle" />
              <p>440</p>
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="p-0">
            <img
              src={`${news.src}`}
              alt="news-img"
              className="w-full object-cover aspect-video"
            />
            <div className="p-6">
              <CardDescription className="text-primary max-sm:text-xs">
                Новости
              </CardDescription>
              <CardTitle className="text-base md:text-2xl tracking-wider">
                Новость 1
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil
              repellendus eius nostrum id blanditiis. Qui sit incidunt
              consequuntur id deleniti officiis voluptas mollitia, sint,
              voluptate aspernatur voluptatum facilis velit libero commodi
              doloremque.
            </p>
          </CardContent>
          <CardFooter className="text-xs flex items-center justify-between">
            <p>03.12.2024</p>
            <span className="flex items-center">
              <Eye className="size-4 inline mr-1 align-middle" />
              <p>440</p>
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="p-0">
            <img
              src={`${news.src}`}
              alt="news-img"
              className="w-full object-cover aspect-video"
            />
            <div className="p-6">
              <CardDescription className="text-primary max-sm:text-xs">
                Новости
              </CardDescription>
              <CardTitle className="text-base md:text-2xl tracking-wider">
                Новость 1
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil
              repellendus eius nostrum id blanditiis. Qui sit incidunt
              consequuntur id deleniti officiis voluptas mollitia, sint,
              voluptate aspernatur voluptatum facilis velit libero commodi
              doloremque.
            </p>
          </CardContent>
          <CardFooter className="text-xs flex items-center justify-between">
            <p>03.12.2024</p>
            <span className="flex items-center">
              <Eye className="size-4 inline mr-1 align-middle" />
              <p>440</p>
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="p-0">
            <img
              src={`${news.src}`}
              alt="news-img"
              className="w-full object-cover aspect-video"
            />
            <div className="p-6">
              <CardDescription className="text-primary max-sm:text-xs">
                Новости
              </CardDescription>
              <CardTitle className="text-base md:text-2xl tracking-wider">
                Новость 1
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil
              repellendus eius nostrum id blanditiis. Qui sit incidunt
              consequuntur id deleniti officiis voluptas mollitia, sint,
              voluptate aspernatur voluptatum facilis velit libero commodi
              doloremque.
            </p>
          </CardContent>
          <CardFooter className="text-xs flex items-center justify-between">
            <p>03.12.2024</p>
            <span className="flex items-center">
              <Eye className="size-4 inline mr-1 align-middle" />
              <p>440</p>
            </span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default PromotionCards;
