---
layout: post
title:  "N-Body Simulation"
date:   2015-08-14 13:00:00
categories: programming
tags: programming c++ physics numerical simulation
---

After learning a great deal more about pointers and dynamic memory allocation
from [Petri][petri-repo]. I decided to try my hand at something more in line with
my physics education. Somewhat ambitiously, my first thought was to create a
program that generated a random set of stars and placed them on a grid to form
a kind of proto-galaxy based on their interactions.

The first thing I looked at was stellar evolution and Hertzprung-Russell diagrams,
which I had not studied formally since I was in sixth form. This seemed simple
enough, there was a nice [relationship][hr-hyper] between mass and luminosity for main
sequence stars so I would only need a relationship between mass and time for
80% of stars.

\\[ L = L\_{sun} (\frac{M}{M\_{sun}})^{\sim 3.5} \\]

Additionally, it seemed like there might even be a numerical way
to determine in which direction a star proceeds along the HR diagram based on
it's current position and the time step, though I lacked the data and research
to determine exactly what this might be.

It would also be desirable to use some kind of distribution when seeding the
"galaxy" with stars rather than generate them randomly to make the stars seem
"related" to each other in terms of their formation. There are a few databases
of known stars around that are freely available so I suppose it would be possible
to generate a distribution from there.

When it came to simulation motion however, the real problems seemed to become
quickly apparent. I remembered the warnings from my physics lectures about chaotic
motion with just three bodies, so decided to consult Wikipedia liberally.

Of particular interest was the work of [Sverre Aarseth][sverre], who has spent his entire
life working on optimal computation of the n-body problem, with much of the code publicly
available on his [webpages][nobdy]. For example, nbody6 contains 50,000 lines of
FORTRAN 77 code with features like reformation from collisions, stellar evolution
and every optimization you can dream of. As someone who learned to code "properly" in
Fortran 90 (at this point they dropped the capitialisation), it was nice to revisit
a language which I was more familiar, though obviously there are a few anachronistic quirks.

The next thing I looked for was Haskell implementations of the n-body problem given
the nature of Haskell to reduce the number of lines of code required for a program.
After attempting to read 50,000 lines of F77, this seemed like a welcome change of pace.
A quick search around the web found this [paper][lopez] about a Haskell implementation being
benchmarked against an extremely optimized ANSI C program, which obviously performed much
slower. However, the author did a pretty good job of explaining the problem and his
implementation so it would be quite nice to revisit this at some point and maybe make
my own attempt once I have a better feel for Haskell.

Another area I explored were Octrees, having [read about][octrees] them before in relation
to three dimensional video game physics. This would be quite a cool optimization to include
in my own program given the performance gains and the (relative) ease of implementation.
And although Octrees are obviously very cool, what I found more interesting was the idea
of what an analog in radial co-ordinate systems would look like. I spent a little bit
of time looking around the web for this, but I couldn't find anything about it,
obviously I could just be using the wrong search terms, so if anyone knows anything
about this I would encourage you to contact me as I have a burning desire to know now!

Anyway, after revaluating my resources and knowledge after this research I decided
to have a go at implementation of a solar system style system where I could have
a reasonable amount of control of initial conditions. This way I could try and
get my numerical gravity to work correctly before trying to throw an entire
universe into the processor. Thankfully Wikipedia had my back with this [article][solar],
which provided a nice piece of psuedo-code for my simulation:

```
a.old = gravitationfunction(x.old)

x.expect = x.old + v.old * dt

a.expect = gravitationfunction(x.expect)

v.new = v.old + (a.old + a.expect) * 0.5 * dt

x.new = x.old + (v.new + v.old) * 0.5 * dt
```

Armed with my new knowledge of pointers from petri I managed to implement an
update function for my "celestial" objects which would allow me to call things
one at a time. I also created a 3d vector data structure which I found to be
extremely enjoyable, particularly with the implementation of custom operators.
There are a few things that need to be fixed with the program before it actually
displays output, but I was particularly pleased with the resulting function so
I'll just leave it here so people can spot the obvious errors that I can't see.

```c++

// Calculates the acceleration for the next timestep

int Celestial::update(double time_step, unsigned body_index, unsigned total_bodies, Celestial** system)
{

	// Sets all parts of the Vec3 structure to 0.0 as we will be doing a summation
	acceleration_ = 0.0;

	for (unsigned i = 0; i < total_bodies; i++) {
		if (i == body_index) {
			continue;
		}
		else {

			acceleration_ = acceleration_ + gravitational_acceleration(
				position(), system[i]->position(), system[i]->mass());

		}
	}

	Vec3 expected_position;

	expected_position = position() + velocity_ * time_step;

	Vec3 expected_acceleration = 0.0;

	for (unsigned i = 0; i < total_bodies; i++) {
		if (i == body_index) {
			continue;
		}
		else {

			expected_acceleration = expected_acceleration + gravitational_acceleration(
				expected_position, system[i]->position(), system[i]->mass());

		}
	}

	Vec3 old_velocity = velocity_;

	velocity_ = velocity_ + (acceleration_ + expected_acceleration) * 0.5 * time_step;

	position_ = position_ + (velocity_ + old_velocity) * 0.5 * time_step;

	return 0;
}

```

[petri-repo]:   https://github.com/jchildren/petri
[hr-hyper]:     http://hyperphysics.phy-astr.gsu.edu/hbase/astro/herrus.html#c2
[sverre]:       http://www.ast.cam.ac.uk/~sverre/web/pages/home.htm
[nbody]:        http://www.ast.cam.ac.uk/~sverre/web/pages/nbody.htm
[lopez]:        http://sedici.unlp.edu.ar/bitstream/handle/10915/24123/Documento_completo.pdf?sequence=1
[octrees]:      http://www.gamedev.net/page/resources/_/technical/game-programming/introduction-to-octrees-r3529
[solar]:        https://en.wikipedia.org/wiki/Numerical_model_of_the_Solar_System
