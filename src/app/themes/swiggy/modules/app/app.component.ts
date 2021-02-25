import { Component, OnInit, OnDestroy, Renderer2 } from "@angular/core";
import { ThemeService } from "../../../../services/theme.service";

@Component({
  selector: "app-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss", "../../theme.scss"]
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
