package MultiThreading;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Dedlocak {
	public static void main(String[] args) throws InterruptedException {
		ExecutorService er = Executors.newFixedThreadPool(5);
		for (int i = 0; i < 20; i++) {
			// er.execute(new ThreadExample());
		}

		final String a = "vimal jaiswal";
		final String b = "sudheer jaiswal";
		// Thread-1
        Runnable block1 = new Runnable() {
            public void run() {
                synchronized (a) {
                    try {
                        // Adding delay so that both threads can start trying to
                        // lock resources
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    // Thread-1 have A but need B also
                    synchronized (b) {
                        System.out.println("In block 1");
                    }
                }
            }
        };
 
        // Thread-2
        Runnable block2 = new Runnable() {
            public void run() {
                synchronized (b) {
                    // Thread-2 have B but need A also
                    synchronized (a) {
                        System.out.println("In block 2");
                    }
                }
            }
        };
 
        Thread t1 = new Thread(block1);
        t1.start();
        t1.sleep(199);
        new Thread(block2).start();

	}

}

class ThreadExample implements Runnable {
	

	final String resource2 = "vimal jaiswal";
	final String resource1 = "sudheer jaiswal";
	@Override
	public void run() {
		synchronized (resource1) {
			System.out.println("Thread 1: locked resource 1");

			try {
				Thread.sleep(100);
			} catch (Exception e) {
			}

			synchronized (resource2) {
				System.out.println("Thread 1: locked resource 2");
			}
		}
	}
}