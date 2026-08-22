import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.jobsService.create(user.id, body);
  }

  @Get()
  getOpenJobs() {
    return this.jobsService.getOpenJobs();
  }

  @Get("my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PARENT")
  myJobs(@CurrentUser() user: any) {
    return this.jobsService.getMyJobs(user.id);
  }

  @Get(":id")
  getOne(@Param("id") id: string) {
    return this.jobsService.getJobById(id);
  }
}
