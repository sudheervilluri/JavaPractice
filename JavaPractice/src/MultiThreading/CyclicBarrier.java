package MultiThreading;

import java.util.ArrayList;
import java.util.List;

public class CyclicBarrier {
	public static void main(String[] args) throws InterruptedException {
		MyThread t = new MyThread();
		java.util.concurrent.CyclicBarrier cb = new java.util.concurrent.CyclicBarrier(2, t);
		
		List<Thread> threads = new ArrayList<Thread>(100);
	     for (int i = 0; i < 100; i++) {
	       Thread thread = new Thread(new MyThread());
	       threads.add(thread);
	       thread.start();
	     }

	     // wait until done
	     for (Thread thread : threads)
	       thread.join();
	   }
		
		
	
}
class MyThread implements Runnable{
	int i =0;

	@Override
	public void run() {
		System.out.println(Thread.currentThread().getName() );
		
		i++;
	}
	
}