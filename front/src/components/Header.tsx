import { Component } from "solid-js";
import { Breadcrumbs } from "@kobalte/core";
import "./Header.css";

const Header: Component = () => {
    return (<>
            <div class="topNav">
            <img src="src/logo.png" alt="logo" height="70px"/>
            <Breadcrumbs.Root separator=" / ">
                <ol class="breadcrumbs__list">
                    <li class="breadcrumbs__item">
                        <Breadcrumbs.Link href="/" class="breadcrumbs__link">
                            Home
                        </Breadcrumbs.Link>
                        <Breadcrumbs.Separator class="breadcrumbs__separator" />
                    </li>
                    <li class="breadcrumbs__item">
                        <Breadcrumbs.Link href="/components" class="breadcrumbs__link">
                            Components
                        </Breadcrumbs.Link>
                        <Breadcrumbs.Separator class="breadcrumbs__separator" />
                    </li>
                    <li class="breadcrumbs__item">
                        <Breadcrumbs.Link href="/" class="breadcrumbs__link">
                            Home
                        </Breadcrumbs.Link>
                        <Breadcrumbs.Separator class="breadcrumbs__separator" />
                    </li>
                    <li class="breadcrumbs__item">
                        <Breadcrumbs.Link href="/" class="breadcrumbs__link">
                            Home
                        </Breadcrumbs.Link>
                        <Breadcrumbs.Separator class="breadcrumbs__separator" />
                    </li>
                </ol>
            </Breadcrumbs.Root>
            </div>
        </>
    )
}

export default Header