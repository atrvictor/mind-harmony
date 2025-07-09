import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon, UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function NavigationMenuDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex w-full pl-1 pr-4 items-center justify-between" style={{ minHeight: '64px' }}>
        <div className="flex">
          <div className="flex overflow-x-auto whitespace-nowrap">
            <Link to="/" className="flex items-center mr-6">
              {/* <img src="/logo.svg" alt="Mind Harmony Logo" className="h-8 w-8 mr-2" /> */}
              <span className="text-2xl font-bold text-[#1E3A5F]">
                Mind{' '}
                <span className="bg-gradient-to-r from-[#7ecbff] via-[#f7b2e6] to-[#ff5e62] text-transparent bg-clip-text font-bold" style={{ filter: 'brightness(1.15)' }}>
                  Harmony
                </span>
              </span>
            </Link>
            <NavigationMenu className="inline-flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>About</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#E5F0F9]/50 to-[#F5F0E5]/50 p-6 no-underline outline-none focus:shadow-md"
                      to="/about"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Mind Harmony
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Discover our mission to transform lives through the
                        power of piano-guided meditation.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem to="/about" title="About Us">
                  Learn about our story and mission
                </ListItem>
                <ListItem to="/events" title="Events">
                  Explore our upcoming events and sessions
                </ListItem>
                <ListItem to="/contact" title="Contact">
                  Get in touch with our team
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/events">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Events
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/meditations">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Meditations
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
                  <Link to="/harmonize">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Harmonize
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/contact">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contact
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4 flex items-center w-24 justify-end">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" aria-label="Profile" className="flex items-center">
                <UserIcon className="h-6 w-6 text-[#1E3A5F]" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2">
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login" aria-label="Login" className="flex items-center">
              <img
                src="/Logon.png"
                alt="Login"
                className="h-10 w-10 object-contain"
              />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-6 w-6" />

              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Mind Harmony</SheetTitle>
              <SheetDescription>
                Piano-guided meditation for inner peace
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4">
              <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>
                About
              </MobileNavLink>
              <MobileNavLink to="/events" onClick={() => setIsOpen(false)}>
                Events
              </MobileNavLink>
              <MobileNavLink to="/meditations" onClick={() => setIsOpen(false)}>
                Meditations
              </MobileNavLink>
              <MobileNavLink to="/harmonize" onClick={() => setIsOpen(false)}>
                Harmonize
              </MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>
                Contact
              </MobileNavLink>
              {user ? (
                <>
                  <MobileNavLink to="/profile" onClick={() => setIsOpen(false)}>
                    <span className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Profile
                    </span>
                  </MobileNavLink>
                  <Button variant="ghost" size="sm" onClick={async () => { await signOut(); setIsOpen(false); navigate("/"); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <MobileNavLink to="/login" onClick={() => setIsOpen(false)}>
                  <span className="flex items-center gap-2">
                    <img src="/Logon.png" alt="Login" className="h-7 w-7 object-contain" />
                    Login
                  </span>
                </MobileNavLink>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      className="group flex w-full items-center py-2 text-lg font-medium transition-colors hover:text-[#1E3A5F]"
      onClick={onClick}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-auto h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string; title: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          to={to}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
