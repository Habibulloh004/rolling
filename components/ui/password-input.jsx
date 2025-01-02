"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const t = useTranslations("Register");
  const [showPassword, setShowPassword] = React.useState(false);
  const disabled =
    props.value === "" || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="max-sm:hidden absolute -right-3 -top-9  h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <Eye
            className={`${showPassword ? "text-white" : "text-white/50"}`}
            size={32}
          />
        ) : (
          // <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          <EyeOff
            size={32}
            className={`${showPassword ? "text-white" : "text-white/50"}`}
          />
        )}
        <h1
          className={`textSmall2 ${
            showPassword ? "text-white" : "text-white/50"
          }`}
        >
          {t("password")}
        </h1>
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="sm:hidden absolute right-0 top-0  h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <Eye
            className={`${showPassword ? "text-white" : "text-white/50"}`}
            size={32}
          />
        ) : (
          // <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          <>
            <EyeClosed
              size={32}
              className={`${
                showPassword ? "text-white" : "text-white/50"
              } sm:hidden`}
            />
            <EyeOff
              size={32}
              className={`${
                showPassword ? "text-white" : "text-white/50"
              } max-sm:hidden`}
            />
          </>
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
