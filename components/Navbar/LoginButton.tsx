'use client';
import React, {useState} from 'react';
import {signIn, signOut} from "next-auth/react";
import {ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import {Session} from "next-auth";
import {AdminPanelSettings, Class, Logout, OpenInNew, Person, Refresh, Settings} from "@mui/icons-material";
import NavDropdown from "@/components/Navbar/NavDropdown";
import Link from "next/link";
import {getRating} from "@/lib/vatsim";
import NavSidebarButton from "@/components/Sidebar/NavSidebarButton";
import NavButton from "@/components/Navbar/NavButton";
import NavSidebar from "@/components/Sidebar/NavSidebar";
import {usePathname} from "next/navigation";
import {refreshAccountData} from "@/actions/user";
import {toast} from "react-toastify";

export default function LoginButton({session, sidebar,}: { session: Session | null, sidebar?: boolean, }) {

    const [dropdownAnchor, setDropdownAnchor] = React.useState<null | HTMLElement>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const handleRefresh = async () => {
        if (!session) return;

        const error = await refreshAccountData(session?.user);
        if (error) {
            toast('Error refreshing account information.', {type: 'error'});
            return;
        }

        toast('Account information refreshed.', {type: 'success'});
    }

    const handleClick = (e: { currentTarget: HTMLElement | EventTarget | null, }) => {
        if (!session) {
            signIn('vatsim', {
                callbackUrl: pathname,
            });
        } else {
            setDropdownAnchor(e.currentTarget as HTMLElement);
            if (sidebar) {
                setSidebarOpen((prev) => !prev);
            }
        }
    };

    const closeDropdown = () => {
        setDropdownAnchor(null);
    }

    const logout = () => {
        signOut({
            callbackUrl: pathname,
        }).then(() => {
            closeDropdown();
        });
    }

    return (
        <>
            {sidebar && <NavSidebarButton icon={<Person/>}
                                          text={session ? `${session.user.fullName} - ${getRating(session.user.rating)}` : 'Login'}
                                          isSidebar onClick={handleClick}/>}
            {sidebarOpen && session && <NavSidebar initialOpen title="Account" onClose={() => setSidebarOpen(false)}>
                {session.user.roles.length > 0 &&
                    <Link href="/profile/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                    <NavSidebarButton icon={<Settings/>} text="Profile"/>
                    </Link>}
                {session?.user.roles.some((r) => ["STAFF"].includes(r)) &&
                    <Link href="/admin/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<AdminPanelSettings/>} text="Facility Administration"/>
                    </Link>}
                {session?.user.roles.some((r) => ["MENTOR", "INSTRUCTOR", "STAFF"].includes(r)) &&
                    <Link href="/training/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<Class/>} text="Training Administration"/>
                    </Link>}
                <NavSidebarButton icon={<Refresh/>} text="Refresh VATUSA Account Information" onClick={handleClick}/>
                {session?.user.controllerStatus !== "NONE" &&
                    <Link href="https://training.vzdc.org/" style={{textDecoration: 'none', color: 'inherit',}}>
                        <NavSidebarButton icon={<OpenInNew/>} text="Training Scheduler"/>
                    </Link>}
                <NavSidebarButton icon={<Logout/>} text="Logout" onClick={logout}/>
            </NavSidebar>}
            {!sidebar && <NavButton icon={null}
                                    text={session ? `${session.user.fullName} - ${getRating(session.user.rating)}` : 'Login'}
                                    isDropdown dropdownOpen={!!dropdownAnchor} onClick={handleClick}/>}
            {!sidebar && <NavDropdown open={!!dropdownAnchor} anchorElement={dropdownAnchor} onClose={closeDropdown}>
                {session?.user.controllerStatus !== "NONE" &&
                    <Link href="/profile/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                    <MenuItem onClick={closeDropdown}>
                        <ListItemIcon>
                            <Settings/>
                        </ListItemIcon>
                        <ListItemText>Profile</ListItemText>
                    </MenuItem>
                    </Link>}
                {session?.user.roles.some((r) => ["STAFF"].includes(r)) &&
                    <Link href="/admin/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <MenuItem onClick={closeDropdown}>
                            <ListItemIcon>
                                <AdminPanelSettings/>
                            </ListItemIcon>
                            <ListItemText>Facility Administration</ListItemText>
                        </MenuItem>
                    </Link>}
                {session?.user.roles.some((r) => ["MENTOR", "INSTRUCTOR", "STAFF"].includes(r)) &&
                    <Link href="/training/overview" style={{textDecoration: 'none', color: 'inherit',}}>
                        <MenuItem onClick={closeDropdown}>
                            <ListItemIcon>
                                <Class/>
                            </ListItemIcon>
                            <ListItemText>Training Administration</ListItemText>
                        </MenuItem>
                    </Link>}
                <MenuItem onClick={handleRefresh}>
                    <ListItemIcon>
                        <Refresh/>
                    </ListItemIcon>
                    <ListItemText>Refresh VATUSA Account Information</ListItemText>
                </MenuItem>
                {session?.user.controllerStatus == "VISITOR" || "HOME" &&
                    <Link href="https://training.vzdc.org/" style={{textDecoration: 'none', color: 'inherit',}}>
                        <MenuItem onClick={closeDropdown}>
                            <ListItemIcon>
                                <OpenInNew/>
                            </ListItemIcon>
                            <ListItemText>Training Scheduler</ListItemText>
                        </MenuItem>
                    </Link>}
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout/>
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </NavDropdown>}
        </>

    );
}

