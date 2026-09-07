import { Controller, Post, Get, Body, Param, UseGuards } from "@nestjs/common";
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
  createJob(@CurrentUser() user: any, @Body() body: any) {
    return this.jobsService.createJob(user.id, body);
  }

  @Get("/:id")
  getJobById(@Param("id") id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post("/:jobId/apply")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("TEACHER")
  applyToJob(@CurrentUser() user: any, @Param("jobId") jobId: string) {
    return this.jobsService.applyToJob(user.id, jobId);
  }
}