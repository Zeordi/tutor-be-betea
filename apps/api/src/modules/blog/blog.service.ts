import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@tutor/database";

@Injectable()
export class BlogService {
  async listPublished() {
    return prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverUrl: true,
        publishedAt: true,
      },
    });
  }

  async getBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.published) {
      throw new NotFoundException("Post not found");
    }
    return post;
  }

  async adminUpsert(data: {
    id?: string;
    slug: string;
    title: string;
    excerpt?: string;
    body: string;
    coverUrl?: string;
    published?: boolean;
  }) {
    const published = !!data.published;
    if (data.id) {
      return prisma.blogPost.update({
        where: { id: data.id },
        data: {
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          body: data.body,
          coverUrl: data.coverUrl,
          published,
          publishedAt: published ? new Date() : null,
        },
      });
    }
    return prisma.blogPost.create({
      data: {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        body: data.body,
        coverUrl: data.coverUrl,
        published,
        publishedAt: published ? new Date() : null,
      },
    });
  }

  async adminList() {
    return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  }
}