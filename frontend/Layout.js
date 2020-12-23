import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

function MenuLink({children, href}) {
  return <Link to={href} className="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md">{children}</Link>
}

function MenuIcon({ icon }) {
  return (
    <Icon icon={icon} className="mr-3 h-6 w-6 text-indigo-300" fixedWidth />
  );
}

function AppMenu() {
  return (
    <>
      <MenuLink href="/">
        <MenuIcon icon="home"  />
        Home
      </MenuLink>

      <MenuLink href="/issues">
        <MenuIcon icon="book-dead"  />
        Issues
      </MenuLink>

      <MenuLink href="/series">
        <MenuIcon icon="layer-group"  />
        Series
      </MenuLink>

      <MenuLink href="/story-lines">
        <MenuIcon icon="stream"  />
        Story Lines
      </MenuLink>

      <MenuLink href="/publishers">
        <MenuIcon icon="print"  />
        Publishers
      </MenuLink>

      <MenuLink href="/creators">
        <MenuIcon icon="paint-brush"  />
        Creators
      </MenuLink>

      <MenuLink href="/administration">
        <MenuIcon icon="cogs"  />
        Administration
      </MenuLink>
    </>
  );
}

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (

<div className="h-screen flex overflow-hidden bg-gray-100">
  {/* <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. --> */}
  {isMobileMenuOpen && (
  <div className="md:hidden">
    <div className="fixed inset-0 flex z-40">
      {/* <!--
        Off-canvas menu overlay, show/hide based on off-canvas menu state.

        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      --> */}
      <div className="fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>
      {/* <!--
        Off-canvas menu, show/hide based on off-canvas menu state.

        Entering: "transition ease-in-out duration-300 transform"
          From: "-translate-x-full"
          To: "translate-x-0"
        Leaving: "transition ease-in-out duration-300 transform"
          From: "translate-x-0"
          To: "-translate-x-full"
      --> */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span className="sr-only">Close sidebar</span>
            <Icon icon="times" className="h-6 w-6 text-white" onClick={() => setIsMobileMenuOpen(false)} />
          </button>
        </div>
        <div className="flex items-center flex-shrink-0 space-x-2 px-4">
          <Icon icon="book-open" className="text-white" />
          <span className="text-white text-xl font-semibold">Comic Reader 12</span>
        </div>
        <div className="mt-5 flex-1 h-0 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {/* <!-- Current: "bg-indigo-800 text-white", Default: "text-indigo-100 hover:bg-indigo-600" --> */}
            <AppMenu />
          </nav>
        </div>
      </div>
      <div className="flex-shrink-0 w-14" aria-hidden="true">
        {/* <!-- Dummy element to force sidebar to shrink to fit close icon --> */}
      </div>
    </div>
  </div>
  )}

  {/* <!-- Static sidebar for desktop --> */}
  <div className="hidden bg-indigo-700 md:flex md:flex-shrink-0">
    <div className="flex flex-col w-64">
      {/* <!-- Sidebar component, swap this element with another sidebar if you like --> */}
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 space-x-2 px-4">
          <Icon icon="book-open" className="text-white" />
          <span className="text-white text-xl font-semibold">Comic Reader 12</span>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {/* <!-- Current: "bg-indigo-800 text-white", Default: "text-indigo-100 hover:bg-indigo-600" --> */}
            <AppMenu />
          </nav>
        </div>
      </div>
    </div>
  </div>
  <div className="flex flex-col w-0 flex-1 overflow-hidden">
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
        <span className="sr-only">Open sidebar</span>
        <Icon icon="bars" className="h-6 w-6" onClick={() => setIsMobileMenuOpen(true)} />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <form className="w-full flex md:ml-0" action="#" method="GET">
            <label htmlFor="search_field" className="sr-only">Search</label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <Icon icon="search" className="h-5 w-5" />
              </div>
              <input id="search_field" className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search" />
            </div>
          </form>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/*<button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">View notifications</span>
            <Icon icon="bell" className="h-4 w-4" fixedWidth />
           </button>*/}

          {/* <!-- Profile dropdown --> */}
          {/* <div className="ml-3 relative">
            <div>
              <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu" aria-haspopup="true">
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
              </button>
            </div> */}
            {/* <!--
              Profile dropdown panel, show/hide based on dropdown state.

              Entering: "transition ease-out duration-100"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            --> */}
            {/*<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a>

              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>

              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</a>
            </div>
          </div>*/}
        </div>
      </div>
    </div>

    <main className="flex-1 relative overflow-y-auto focus:outline-none" tabIndex="0">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* <!-- Replace with your content --> */}
          <div className="">
            {children}
          </div>
          {/* <!-- /End replace --> */}
        </div>
      </div>
    </main>
  </div>
</div>


  )
}
