import React from "react";
import OpeningsGrid from "@/components/grids/OpeningsGrid";
import NavbarComponent from "@/components/navbar/Navbar";
import PageWrapper from "@/components/wrapper/pageWrapper";

const LearnPage = () => {
    return (
        <>
            <PageWrapper>
                <NavbarComponent />
                <div className="flex w-full justify-center">
                    <span className="lg:text-4xl text-3xl font-bold">
                        Pick Openings to Train
                    </span>
                </div>
                <OpeningsGrid />
            </PageWrapper>
        </>
    );
}

export default LearnPage;