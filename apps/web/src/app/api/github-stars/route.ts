import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  try {
    const response = await fetch('https://api.github.com/repos/Kaycee276/cicero', {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ count: null }, { status: 200 });
    }

    const repository = (await response.json()) as { stargazers_count?: unknown };
    const count =
      typeof repository.stargazers_count === 'number' ? repository.stargazers_count : null;

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: null }, { status: 200 });
  }
}
