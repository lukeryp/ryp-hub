import { ProjectDetail } from '@/components/project-detail'

export default async function ProjectPage(props: PageProps<'/projects/[slug]'>) {
  const { slug } = await props.params
  return <ProjectDetail slug={slug} />
}
